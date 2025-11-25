import axios from 'axios';
import { Logger } from '@/shared/utils/helpers/logger';

const API_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'https://api.example.com';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    Logger.log('[API] Request:', { url: config.url, method: config.method });
    return config;
  },
  (error) => {
    Logger.error('[API] Request error:', error);
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    Logger.log('[API] Response:', { url: response.config.url, status: response.status });
    return response;
  },
  (error) => {
    Logger.error('[API] Response error:', error);
    return Promise.reject(error);
  },
);

export default apiClient;
