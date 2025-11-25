interface LogEntry {
  message: string;
  data?: unknown;
  timestamp: number;
}

// Lưu trữ các log gần đây để ngăn trùng lặp
const recentLogs = new Map<string, LogEntry>();
const LOG_DEDUPE_WINDOW = 1000; // Cửa sổ 1 giây

// Hằng số giới hạn kích thước
const MAX_LOG_SIZE = 100 * 1024; // Tối đa 100KB cho mỗi log entry
const MAX_OBJECT_DEPTH = 3; // Độ sâu lồng nhau tối đa
const MAX_ARRAY_ITEMS = 5; // Số phần tử mảng tối đa để log
const MAX_OBJECT_KEYS = 20; // Số thuộc tính object tối đa để log
const MAX_ERROR_DATA_SIZE = 10 * 1024; // Tối đa 10KB cho dữ liệu phản hồi lỗi

// Các trường nên được ẩn hoàn toàn
const SENSITIVE_FIELDS = [
  'access_token',
  'refresh_token',
  'session_id',
  'sessionId',
  'password',
  'pincode',
  'token',
  'authorization',
  'Authorization',
];

// Các trường nên được che giấu
const MASKABLE_FIELDS = ['phone', 'email', 'user_id', 'userId'];

/**
 * Che giấu các giá trị string nhạy cảm
 * @param value - Giá trị cần che giấu
 * @param showLast - Số ký tự cuối hiển thị (mặc định 4)
 * @returns Giá trị đã được che giấu
 */
const maskSensitiveValue = (value: string, showLast: number = 4): string => {
  if (typeof value !== 'string' || value.length <= showLast) {
    return '***';
  }
  const masked = '*'.repeat(Math.max(value.length - showLast, 3));
  return masked + value.slice(-showLast);
};

/**
 * Ước tính kích thước của một object theo byte (ước tính gần đúng)
 * @param obj - Object cần ước tính
 * @returns Kích thước ước tính theo byte
 */
const estimateObjectSize = (obj: unknown): number => {
  try {
    return JSON.stringify(obj).length * 2; // Ước tính gần đúng: 2 bytes mỗi ký tự
  } catch {
    return Infinity; // Nếu không thể stringify, giả định quá lớn
  }
};

/**
 * Cắt ngắn các object/array lớn để ngăn cạn kiệt bộ nhớ
 * @param data - Dữ liệu cần cắt ngắn
 * @param depth - Độ sâu hiện tại
 * @returns Dữ liệu đã được cắt ngắn
 */
const truncateObject = (data: unknown, depth = 0): unknown => {
  if (depth > MAX_OBJECT_DEPTH || data === null || data === undefined) {
    return depth > MAX_OBJECT_DEPTH ? '[Max depth exceeded]' : data;
  }

  // Xử lý mảng
  if (Array.isArray(data)) {
    if (data.length > MAX_ARRAY_ITEMS) {
      const truncated = data.slice(0, MAX_ARRAY_ITEMS).map((item) => truncateObject(item, depth + 1));
      truncated.push(`[... ${data.length - MAX_ARRAY_ITEMS} more items]`);
      return truncated;
    }
    return data.map((item) => truncateObject(item, depth + 1));
  }

  // Xử lý objects
  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length > MAX_OBJECT_KEYS) {
      const truncated: Record<string, unknown> = {};
      entries.slice(0, MAX_OBJECT_KEYS).forEach(([key, value]) => {
        truncated[key] = truncateObject(value, depth + 1);
      });
      truncated['__truncated__'] = `... ${entries.length - MAX_OBJECT_KEYS} more properties`;
      return truncated;
    }

    const result: Record<string, unknown> = {};
    entries.forEach(([key, value]) => {
      result[key] = truncateObject(value, depth + 1);
    });
    return result;
  }

  // Xử lý chuỗi (giới hạn 1000 ký tự)
  if (typeof data === 'string' && data.length > 1000) {
    return `${data.substring(0, 1000)}... [${data.length - 1000} more chars]`;
  }

  return data;
};

/**
 * Làm sạch object dữ liệu để loại bỏ/che giấu thông tin nhạy cảm
 * Hiện bao gồm giới hạn kích thước để ngăn cạn kiệt bộ nhớ
 * @param data - Dữ liệu cần làm sạch
 * @param depth - Độ sâu hiện tại
 * @returns Dữ liệu đã được làm sạch
 */
const sanitizeData = (data: unknown, depth = 0): unknown => {
  // Ngăn đệ quy vô hạn
  if (depth > MAX_OBJECT_DEPTH || data === null || data === undefined) {
    return depth > MAX_OBJECT_DEPTH ? '[Max depth exceeded]' : data;
  }

  // Kiểm tra kích thước trước - nếu quá lớn, cắt ngắn trước khi xử lý
  const estimatedSize = estimateObjectSize(data);
  if (estimatedSize > MAX_LOG_SIZE) {
    return truncateObject(data, depth);
  }

  // Xử lý mảng
  if (Array.isArray(data)) {
    if (data.length > MAX_ARRAY_ITEMS) {
      const sanitized = data.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizeData(item, depth + 1));
      sanitized.push(`[... ${data.length - MAX_ARRAY_ITEMS} more items]`);
      return sanitized;
    }
    return data.map((item) => sanitizeData(item, depth + 1));
  }

  // Xử lý objects
  if (typeof data === 'object') {
    const entries = Object.entries(data);
    const sanitized: Record<string, unknown> = {};

    // Giới hạn số lượng keys nếu quá nhiều
    const keysToProcess = entries.length > MAX_OBJECT_KEYS ? entries.slice(0, MAX_OBJECT_KEYS) : entries;

    for (const [key, value] of keysToProcess) {
      const lowerKey = key.toLowerCase();

      // Ẩn các trường nhạy cảm hoàn toàn
      if (SENSITIVE_FIELDS.some((field) => field.toLowerCase() === lowerKey)) {
        sanitized[key] = '[HIDDEN]';
        continue;
      }

      // Che giấu các trường nhất định
      if (MASKABLE_FIELDS.some((field) => field.toLowerCase() === lowerKey) && typeof value === 'string') {
        sanitized[key] = maskSensitiveValue(value);
        continue;
      }

      // Làm sạch đệ quy các object lồng nhau
      if (typeof value === 'object') {
        sanitized[key] = sanitizeData(value, depth + 1);
      } else if (typeof value === 'string' && value.length > 1000) {
        // Cắt ngắn chuỗi dài
        sanitized[key] = `${value.substring(0, 1000)}... [${value.length - 1000} more chars]`;
      } else {
        sanitized[key] = value;
      }
    }

    // Thêm marker cắt ngắn nếu chúng ta đã bỏ qua keys
    if (entries.length > MAX_OBJECT_KEYS) {
      sanitized['__truncated__'] = `... ${entries.length - MAX_OBJECT_KEYS} more properties`;
    }

    return sanitized;
  }

  // Xử lý chuỗi dài
  if (typeof data === 'string' && data.length > 1000) {
    return `${data.substring(0, 1000)}... [${data.length - 1000} more chars]`;
  }

  return data;
};

/**
 * Kiểm tra xem logging có nên được bật không (chỉ trong development)
 * @returns true nếu logging được bật
 */
const isLoggingEnabled = (): boolean => {
  return __DEV__ || process.env.NODE_ENV === 'development';
};

/**
 * Trích xuất chi tiết lỗi một cách an toàn từ kiểu lỗi không xác định
 * Hiện loại trừ dữ liệu response/request lớn để ngăn cạn kiệt bộ nhớ
 * @param error - Lỗi cần trích xuất chi tiết
 * @returns Chi tiết lỗi đã được trích xuất
 */
const getErrorDetails = (
  error: unknown,
): {
  name?: string;
  message: string;
  stack?: string;
  status?: number;
  statusText?: string;
  data?: unknown;
  code?: string;
  config?: {
    method?: string;
    url?: string;
    headers?: string;
  };
} => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === 'object' && error !== null) {
    // Xử lý lỗi Axios và các object lỗi có cấu trúc khác
    const errorObj = error as {
      message?: string;
      response?: {
        status?: number;
        statusText?: string;
        data?: unknown;
      };
      code?: string;
      config?: {
        method?: string;
        url?: string;
        headers?: unknown;
        data?: unknown;
      };
    };

    // Kiểm tra kích thước dữ liệu response và loại trừ nếu quá lớn
    let responseData: unknown = errorObj.response?.data;
    if (responseData) {
      const dataSize = estimateObjectSize(responseData);
      if (dataSize > MAX_ERROR_DATA_SIZE) {
        responseData = `[Data too large: ~${Math.round(dataSize / 1024)}KB, omitted to prevent memory issues]`;
      }
    }

    // Trích xuất chỉ thông tin config cần thiết, loại trừ request body
    const configInfo = errorObj.config
      ? {
          method: errorObj.config.method,
          url: errorObj.config.url,
          headers: errorObj.config.headers ? `${Object.keys(errorObj.config.headers).length} headers` : undefined,
          // Loại trừ rõ ràng config.data (request body) để ngăn log các upload lớn
        }
      : undefined;

    return {
      message: errorObj.message || 'Unknown error',
      status: errorObj.response?.status,
      statusText: errorObj.response?.statusText,
      data: responseData,
      code: errorObj.code,
      config: configInfo,
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  return { message: String(error) };
};

/**
 * Trích xuất thông báo lỗi một cách an toàn từ kiểu lỗi không xác định (tương thích legacy)
 * @param error - Lỗi cần trích xuất thông báo
 * @returns Thông báo lỗi
 */
const getErrorMessage = (error: unknown): string => {
  const details = getErrorDetails(error);
  return details.message || 'Unknown error';
};

/**
 * Dọn dẹp các log entry cũ
 */
const cleanupOldLogs = () => {
  const now = Date.now();
  for (const [key, entry] of recentLogs.entries()) {
    if (now - entry.timestamp > LOG_DEDUPE_WINDOW) {
      recentLogs.delete(key);
    }
  }
};

/**
 * Tạo key cho log deduplication
 * @param message - Thông báo log
 * @param data - Dữ liệu log (tùy chọn)
 * @returns Key được tạo
 */
const generateLogKey = (message: string, data?: unknown): string => {
  const dataStr = data ? JSON.stringify(data) : '';
  return `${message}|${dataStr}`;
};

/**
 * Logger thông minh ngăn log trùng lặp và làm sạch dữ liệu nhạy cảm
 */
export const Logger = {
  /**
   * Log với deduplication và làm sạch dữ liệu
   * @param message - Thông báo log
   * @param data - Dữ liệu log (tùy chọn)
   */
  log: (message: string, data?: unknown) => {
    if (!isLoggingEnabled()) {
      return;
    }

    const sanitizedData = data ? sanitizeData(data) : undefined;
    const key = generateLogKey(message, sanitizedData);
    const now = Date.now();

    cleanupOldLogs();

    const existing = recentLogs.get(key);
    if (existing && now - existing.timestamp < LOG_DEDUPE_WINDOW) {
      return; // Bỏ qua log trùng lặp
    }

    recentLogs.set(key, { message, data: sanitizedData, timestamp: now });

    if (sanitizedData !== undefined) {
      // eslint-disable-next-line no-console
      console.log(message, sanitizedData);
    } else {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  },

  /**
   * Log cảnh báo với deduplication và làm sạch dữ liệu
   * @param message - Thông báo log
   * @param data - Dữ liệu log (tùy chọn)
   */
  warn: (message: string, data?: unknown) => {
    if (!isLoggingEnabled()) {
      return;
    }

    const sanitizedData = data ? sanitizeData(data) : undefined;
    const key = generateLogKey(message, sanitizedData);
    const now = Date.now();

    cleanupOldLogs();

    const existing = recentLogs.get(key);
    if (existing && now - existing.timestamp < LOG_DEDUPE_WINDOW) {
      return; // Bỏ qua log trùng lặp
    }

    recentLogs.set(key, { message, data: sanitizedData, timestamp: now });

    if (sanitizedData !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(message, sanitizedData);
    } else {
      // eslint-disable-next-line no-console
      console.warn(message);
    }
  },

  /**
   * Luôn log (bỏ qua deduplication) - cho các lỗi quan trọng
   * Vẫn làm sạch dữ liệu để bảo mật
   * @param message - Thông báo log
   * @param data - Dữ liệu log (tùy chọn)
   */
  error: (message: string, data?: unknown) => {
    if (!isLoggingEnabled()) {
      return;
    }

    const sanitizedData = data ? sanitizeData(data) : undefined;

    if (sanitizedData !== undefined) {
      // eslint-disable-next-line no-console
      console.error(message, sanitizedData);
    } else {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  },

  /**
   * Log debug - chỉ trong development, với làm sạch đầy đủ
   * @param message - Thông báo log
   * @param data - Dữ liệu log (tùy chọn)
   */
  debug: (message: string, data?: unknown) => {
    if (!isLoggingEnabled()) {
      return;
    }

    const sanitizedData = data ? sanitizeData(data) : undefined;

    if (sanitizedData !== undefined) {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`, sanitizedData);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] ${message}`);
    }
  },

  /**
   * Log bảo mật - cho các thao tác nhạy cảm, làm sạch thêm
   * @param message - Thông báo log
   * @param data - Dữ liệu log (không được sử dụng, chỉ để tương thích)
   */
  secure: (message: string, data?: unknown) => {
    if (!isLoggingEnabled()) {
      return;
    }

    // Đối với secure logs, chúng ta chỉ log thông báo mà không có dữ liệu
    // eslint-disable-next-line no-console
    console.log(`[SECURE] ${message}`);
  },

  /**
   * Xóa tất cả log đã lưu
   */
  clear: () => {
    recentLogs.clear();
  },

  /**
   * Log lỗi an toàn với trích xuất chi tiết lỗi tự động
   * @param message - Thông báo log
   * @param error - Lỗi cần log (tùy chọn)
   */
  errorSafe: (message: string, error?: unknown) => {
    if (!isLoggingEnabled()) {
      return;
    }

    const errorData = error ? getErrorDetails(error) : undefined;
    const sanitizedData = errorData ? sanitizeData(errorData) : undefined;

    if (sanitizedData !== undefined) {
      // eslint-disable-next-line no-console
      console.error(message, sanitizedData);
    } else {
      // eslint-disable-next-line no-console
      console.error(message);
    }
  },

  /**
   * Log lỗi chuyên biệt cho upload file
   * Chỉ log metadata cần thiết, loại trừ hoàn toàn nội dung file
   * @param message - Thông báo log
   * @param error - Lỗi cần log (tùy chọn)
   * @param metadata - Metadata file (tùy chọn)
   */
  uploadError: (
    message: string,
    error?: unknown,
    metadata?: {
      fileSize?: number;
      fileType?: string;
      fileName?: string;
    },
  ) => {
    if (!isLoggingEnabled()) {
      return;
    }

    // Trích xuất chỉ thông tin lỗi cần thiết
    const errorInfo = error ? getErrorDetails(error) : undefined;

    // Tạo object log tối thiểu
    const logData = {
      error: errorInfo
        ? {
            message: errorInfo.message,
            status: errorInfo.status,
            statusText: errorInfo.statusText,
            code: errorInfo.code,
            url: errorInfo.config?.url,
            method: errorInfo.config?.method,
          }
        : undefined,
      file: metadata
        ? {
            size: metadata.fileSize ? `${Math.round(metadata.fileSize / 1024)}KB` : undefined,
            type: metadata.fileType,
            name: metadata.fileName,
          }
        : undefined,
    };

    // eslint-disable-next-line no-console
    console.error(`[UPLOAD ERROR] ${message}`, logData);
  },
};
