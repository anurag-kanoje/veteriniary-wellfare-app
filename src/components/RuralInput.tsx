import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RuralInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  required?: boolean;
  showPasswordToggle?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function RuralInput({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  variant = 'default',
  size = 'medium',
  disabled = false,
  required = false,
  showPasswordToggle = false,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  accessibilityLabel,
  accessibilityHint,
  ...textInputProps
}: RuralInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      borderRadius: 12,
      fontSize: size === 'small' ? 16 : size === 'large' ? 20 : 18,
      paddingHorizontal: size === 'small' ? 12 : size === 'large' ? 20 : 16,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      minHeight: size === 'small' ? 44 : size === 'large' ? 64 : 56,
    };

    const variantStyles = {
      default: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: error ? '#ef4444' : isFocused ? '#4f46e5' : '#e5e7eb',
      },
      outlined: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: error ? '#ef4444' : isFocused ? '#4f46e5' : '#d1d5db',
      },
      filled: {
        backgroundColor: '#f9fafb',
        borderWidth: 0,
        borderBottomWidth: 2,
        borderBottomColor: error ? '#ef4444' : isFocused ? '#4f46e5' : '#e5e7eb',
      },
    };

    const stateStyles = {
      disabled: {
        backgroundColor: '#f3f4f6',
        color: '#9ca3af',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...(disabled && stateStyles.disabled),
      ...inputStyle,
    };
  };

  const getContainerStyle = (): ViewStyle => {
    return {
      marginBottom: size === 'small' ? 12 : size === 'large' ? 24 : 16,
      ...style,
    };
  };

  const getLabelStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 6,
    };

    return { ...baseStyle, ...labelStyle };
  };

  const getErrorStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 12 : size === 'large' ? 14 : 14,
      color: '#ef4444',
      marginTop: 4,
    };

    return { ...baseStyle, ...errorStyle };
  };

  const getHintStyle = (): TextStyle => {
    return {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 4,
    };
  };

  const getIconColor = (): string => {
    if (disabled) return '#9ca3af';
    if (error) return '#ef4444';
    if (isFocused) return '#4f46e5';
    return '#6b7280';
  };

  const getIconSize = (): number => {
    return size === 'small' ? 18 : size === 'large' ? 24 : 20;
  };

  const renderIcon = (position: 'left' | 'right') => {
    if (!icon || iconPosition !== position) {
      return null;
    }

    if (showPasswordToggle && textInputProps.secureTextEntry && position === 'right') {
      return (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.passwordToggle}
          accessible={true}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          accessibilityRole="button"
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={getIconSize()}
            color={getIconColor()}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Ionicons
        name={icon as any}
        size={getIconSize()}
        color={getIconColor()}
        style={styles.inputIcon}
      />
    );
  };

  const renderLabel = () => {
    if (!label) return null;

    return (
      <Text style={getLabelStyle()}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return <Text style={getErrorStyle()}>{error}</Text>;
  };

  const renderHint = () => {
    if (!hint) return null;

    return <Text style={getHintStyle()}>{hint}</Text>;
  };

  return (
    <View style={getContainerStyle()}>
      {renderLabel()}
      
      <View style={styles.inputContainer}>
        {renderIcon('left')}
        
        <TextInput
          style={getInputStyle()}
          placeholderTextColor="#9ca3af"
          editable={!disabled}
          secureTextEntry={textInputProps.secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessible={true}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityState={{ disabled }}
          {...textInputProps}
        />
        
        {renderIcon('right')}
      </View>
      
      {renderError()}
      {renderHint()}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  required: {
    color: '#ef4444',
  },
});
