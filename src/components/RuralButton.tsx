import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RuralButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function RuralButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: RuralButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      minHeight: size === 'small' ? 44 : size === 'large' ? 64 : 56,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? '#9ca3af' : '#4f46e5',
      },
      secondary: {
        backgroundColor: disabled ? '#f3f4f6' : '#e5e7eb',
        borderWidth: 2,
        borderColor: disabled ? '#d1d5db' : '#4f46e5',
      },
      danger: {
        backgroundColor: disabled ? '#fca5a5' : '#ef4444',
      },
      success: {
        backgroundColor: disabled ? '#86efac' : '#10b981',
      },
    };

    return { ...baseStyle, ...variantStyles[variant], ...style };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 16 : size === 'large' ? 20 : 18,
      fontWeight: '600',
      textAlign: 'center',
    };

    const variantStyles = {
      primary: {
        color: disabled ? '#d1d5db' : '#ffffff',
      },
      secondary: {
        color: disabled ? '#9ca3af' : '#4f46e5',
      },
      danger: {
        color: disabled ? '#fef2f2' : '#ffffff',
      },
      success: {
        color: disabled ? '#f0fdf4' : '#ffffff',
      },
    };

    return { ...baseStyle, ...variantStyles[variant], ...textStyle };
  };

  const getIconColor = (): string => {
    if (disabled) {
      return '#9ca3af';
    }
    
    const variantColors = {
      primary: '#ffffff',
      secondary: '#4f46e5',
      danger: '#ffffff',
      success: '#ffffff',
    };
    
    return variantColors[variant];
  };

  const getIconSize = (): number => {
    return size === 'small' ? 18 : size === 'large' ? 24 : 20;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator 
            size="small" 
            color={variant === 'secondary' ? '#4f46e5' : '#ffffff'} 
          />
          <Text style={[getTextStyle(), { marginLeft: 8 }]}>
            {title}
          </Text>
        </>
      );
    }

    const iconElement = icon && (
      <Ionicons 
        name={icon as any} 
        size={getIconSize()} 
        color={getIconColor()} 
      />
    );

    const textElement = <Text style={getTextStyle()}>{title}</Text>;

    if (icon && iconPosition === 'right') {
      return (
        <>
          {textElement}
          <View style={{ marginLeft: 8 }}>
            {iconElement}
          </View>
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          <View style={{ marginRight: 8 }}>
            {iconElement}
          </View>
          {textElement}
        </>
      );
    }

    return textElement;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}
