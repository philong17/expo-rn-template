import { Typography } from '@/shared/constants/themes/Typography';
import { Colors } from '@/shared/constants/themes/Colors';
import React, { JSX } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Text } from '@/shared/ui/Text';
import Animated from 'react-native-reanimated';

interface ButtonProps {
  testID?: string;
  title: string;
  disabled?: boolean;
  pressed: () => void;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  variant?: 'filled' | 'outlined' | 'text' | 'soft';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ViewStyle>;
}

export const Button = ({
  testID,
  title,
  disabled = false,
  pressed,
  loading = false,
  size = 'large',
  color = '#2C93FF',
  variant = 'filled',
  icon,
  iconPosition = 'left',
  style,
  buttonStyle,
  textStyle,
  iconStyle,
}: ButtonProps): JSX.Element => {
  const handlePress = () => {
    pressed();
  };

  const getBackgroundColor = (): string => {
    if (variant === 'filled') return color;
    if (variant === 'soft') return Colors.primary_light;
    return 'transparent';
  };

  const getBorderColor = (): string => {
    if (variant === 'outlined') return color;
    return 'transparent';
  };

  const getTextColor = (): string => {
    if (variant === 'filled') return '#fff';
    if (variant === 'soft') return Colors.primary;
    return color;
  };

  const textStyles = [
    styles.buttonText,
    styles[`${size}Text`],
    { color: getTextColor() },
    disabled && variant === 'filled' && styles.buttonTextDisabled,
    textStyle,
  ];

  return (
    <Pressable
      testID={testID}
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed: isPressed }) => [isPressed && styles.pressed, style]}>
      <Animated.View
        style={[
          styles.buttonBackground,
          styles[size],
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'outlined' ? 1 : 0,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      />
      <Animated.View style={[styles.contentContainer, styles[size], buttonStyle]}>
        {loading ? (
          <ActivityIndicator color={variant === 'filled' ? '#fff' : color} />
        ) : (
          <>
            {icon && iconPosition === 'left' && <Animated.View style={iconStyle}>{icon}</Animated.View>}
            <Text style={textStyles}>{title}</Text>
            {icon && iconPosition === 'right' && <Animated.View style={iconStyle}>{icon}</Animated.View>}
          </>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  small: {
    height: 32,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  buttonTextDisabled: {
    color: '#fff',
  },
  buttonText: {
    ...Typography.bodySemiBoldLG,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
