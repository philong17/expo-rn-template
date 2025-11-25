import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

/**
 * Custom Text component that disables font scaling by default
 * to prevent device font settings from affecting app typography
 */
export interface TextProps extends RNTextProps {
  /**
   * Whether to allow font scaling based on device settings
   * @default false - Font scaling is disabled by default
   */
  allowFontScaling?: boolean;
}

export const Text: React.FC<TextProps> = ({ allowFontScaling = false, ...props }) => {
  return <RNText allowFontScaling={allowFontScaling} {...props} />;
};

Text.displayName = 'Text';

export default Text;
