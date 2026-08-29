import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RuralCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: ImageSourcePropType;
  icon?: string;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  status?: 'info' | 'success' | 'warning' | 'error';
  badge?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'search' | 'image' | 'keyboardkey' | 'text' | 'adjustable' | 'imagebutton' | 'header' | 'summary' | 'alert' | 'none' | 'menuitem';
}

export default function RuralCard({
  children,
  title,
  subtitle,
  description,
  image,
  icon,
  onPress,
  variant = 'default',
  size = 'medium',
  status,
  badge,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  accessible = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
}: RuralCardProps) {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      minHeight: size === 'small' ? 80 : size === 'large' ? 200 : 120,
    };

    const variantStyles = {
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      outlined: {
        borderWidth: 2,
        borderColor: '#e5e7eb',
      },
      elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
    };

    return { ...baseStyle, ...variantStyles[variant], ...style };
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      padding: size === 'small' ? 12 : size === 'large' ? 24 : 16,
    };

    const sizeStyles = {
      small: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
      },
      medium: {
        flexDirection: 'column' as const,
      },
      large: {
        flexDirection: 'column' as const,
      },
    };

    return { ...baseStyle, ...sizeStyles[size], ...contentStyle };
  };

  const getTitleStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 16 : size === 'large' ? 24 : 20,
      fontWeight: '700',
      color: '#111827',
      marginBottom: 4,
    };

    const sizeStyles = {
      small: {
        marginBottom: 2,
      },
      medium: {
        marginBottom: 4,
      },
      large: {
        marginBottom: 8,
      },
    };

    return { ...baseStyle, ...sizeStyles[size], ...titleStyle };
  };

  const getSubtitleStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 12 : size === 'large' ? 18 : 14,
      color: '#6b7280',
      marginBottom: 4,
    };

    const sizeStyles = {
      small: {
        marginBottom: 2,
      },
      medium: {
        marginBottom: 4,
      },
      large: {
        marginBottom: 8,
      },
    };

    return { ...baseStyle, ...sizeStyles[size], ...subtitleStyle };
  };

  const getDescriptionStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
      color: '#374151',
      lineHeight: 20,
    };

    return { ...baseStyle, ...descriptionStyle };
  };

  const getStatusColor = (): string => {
    const statusColors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    };

    return statusColors[status!] || '#6b7280';
  };

  const renderHeader = () => {
    if (!title && !subtitle && !image && !icon) {
      return null;
    }

    return (
      <View style={styles.header}>
        {(image || icon) && (
          <View style={styles.iconContainer}>
            {image ? (
              <Image source={image} style={styles.image} />
            ) : icon ? (
              <Ionicons name={icon as any} size={24} color="#4f46e5" />
            ) : null}
          </View>
        )}
        
        <View style={styles.headerText}>
          {title && <Text style={getTitleStyle()}>{title}</Text>}
          {subtitle && <Text style={getSubtitleStyle()}>{subtitle}</Text>}
        </View>

        {badge && (
          <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (description) {
      return <Text style={getDescriptionStyle()}>{description}</Text>;
    }
    return children;
  };

  const CardComponent = (
    <View style={getCardStyle()}>
      <View style={getContentStyle()}>
        {renderHeader()}
        {renderContent()}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole || 'button'}
        style={style}
      >
        {CardComponent}
      </TouchableOpacity>
    );
  }

  return CardComponent;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
});
