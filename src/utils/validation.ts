import { Alert } from 'react-native';

// Validation schemas using Zod patterns (without Zod dependency)
export interface ValidationRule {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Common validation patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/, // Indian mobile numbers
  PIN_CODE: /^\d{6}$/,
  NAME: /^[a-zA-Z\s\u0900-\u097F]{2,50}$/, // Includes Hindi characters
  ADDRESS: /^.{10,200}$/,
  ANIMAL_NAME: /^[a-zA-Z0-9\s\u0900-\u097F]{1,30}$/,
  DESCRIPTION: /^.{10,500}$/,
};

// Error messages in bilingual format
export const ERROR_MESSAGES = {
  REQUIRED: {
    en: 'This field is required',
    hi: 'यह फ़ील्ड आवश्यक है'
  },
  INVALID_EMAIL: {
    en: 'Please enter a valid email address',
    hi: 'कृपया एक वैध ईमेल पता दर्ज करें'
  },
  INVALID_PHONE: {
    en: 'Please enter a valid 10-digit mobile number',
    hi: 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें'
  },
  MIN_LENGTH: (min: number) => ({
    en: `Minimum ${min} characters required`,
    hi: `न्यूनतम ${min} अक्षर आवश्यक`
  }),
  MAX_LENGTH: (max: number) => ({
    en: `Maximum ${max} characters allowed`,
    hi: `अधिकतम ${max} अक्षर अनुमत`
  }),
};

// Generic validation function
export function validateField(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    // Check if required
    if (rule.required && (!value || value.trim() === '')) {
      return rule.message || ERROR_MESSAGES.REQUIRED.en;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      continue;
    }

    // Check minimum length
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || ERROR_MESSAGES.MIN_LENGTH(rule.minLength).en;
    }

    // Check maximum length
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || ERROR_MESSAGES.MAX_LENGTH(rule.maxLength).en;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format';
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) return customError;
    }
  }

  return null;
}

// Form validation
export function validateForm(data: Record<string, any>, schema: Record<string, ValidationRule[]>): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const error = validateField(data[field] || '', rules);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

// Common validation schemas
export const VALIDATION_SCHEMAS = {
  LOGIN: {
    email: [
      { field: 'email', required: true, pattern: PATTERNS.EMAIL, message: ERROR_MESSAGES.INVALID_EMAIL.en },
    ],
    password: [
      { field: 'password', required: true, minLength: 6, message: 'Password must be at least 6 characters' },
    ],
  },
  
  REGISTER: {
    email: [
      { field: 'email', required: true, pattern: PATTERNS.EMAIL, message: ERROR_MESSAGES.INVALID_EMAIL.en },
    ],
    password: [
      { field: 'password', required: true, minLength: 6, message: 'Password must be at least 6 characters' },
    ],
    fullName: [
      { field: 'fullName', required: true, minLength: 2, maxLength: 50, pattern: PATTERNS.NAME, message: 'Please enter a valid name' },
    ],
    phone: [
      { field: 'phone', pattern: PATTERNS.PHONE, message: ERROR_MESSAGES.INVALID_PHONE.en },
    ],
    role: [
      { field: 'role', required: true, message: 'Please select a role' },
    ],
  },

  ANIMAL: {
    name: [
      { field: 'name', required: true, minLength: 1, maxLength: 30, pattern: PATTERNS.ANIMAL_NAME, message: 'Please enter a valid animal name' },
    ],
    species: [
      { field: 'species', required: true, message: 'Please select animal type' },
    ],
    breed: [
      { field: 'breed', maxLength: 50, message: 'Breed name too long' },
    ],
  },

  RESCUE_REPORT: {
    animalType: [
      { field: 'animalType', required: true, message: 'Please select animal type' },
    ],
    description: [
      { field: 'description', required: true, minLength: 10, maxLength: 500, message: 'Please provide a detailed description (10-500 characters)' },
    ],
    contactPhone: [
      { field: 'contactPhone', required: true, pattern: PATTERNS.PHONE, message: ERROR_MESSAGES.INVALID_PHONE.en },
    ],
    urgencyLevel: [
      { field: 'urgencyLevel', required: true, message: 'Please select urgency level' },
    ],
  },

  CONSULTATION: {
    title: [
      { field: 'title', required: true, minLength: 5, maxLength: 100, message: 'Title must be 5-100 characters' },
    ],
    description: [
      { field: 'description', required: true, minLength: 10, maxLength: 1000, message: 'Description must be 10-1000 characters' },
    ],
    contactPhone: [
      { field: 'contactPhone', required: true, pattern: PATTERNS.PHONE, message: ERROR_MESSAGES.INVALID_PHONE.en },
    ],
    urgencyLevel: [
      { field: 'urgencyLevel', required: true, message: 'Please select urgency level' },
    ],
  },
};

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Network error handler
export function handleNetworkError(error: any): string {
  if (error.code === 'NETWORK_ERROR') {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  if (error.code === 'TIMEOUT') {
    return 'Request timed out. Please try again.';
  }

  if (error.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}

// User-friendly error display
export function showError(message: string, title: string = 'Error') {
  Alert.alert(title, message, [{ text: 'OK' }]);
}

// Success message display
export function showSuccess(message: string, title: string = 'Success') {
  Alert.alert(title, message, [{ text: 'OK' }]);
}

// Confirmation dialog
export function showConfirmation(
  message: string,
  title: string = 'Confirm',
  onConfirm: () => void,
  onCancel?: () => void
) {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'OK', onPress: onConfirm },
    ]
  );
}

// Async error wrapper
export async function safeAsync<T>(
  asyncFn: () => Promise<T>,
  errorMessage?: string
): Promise<[T | null, Error | null]> {
  try {
    const result = await asyncFn();
    return [result, null];
  } catch (error) {
    const appError = error instanceof Error ? error : new Error(String(error));
    return [null, appError];
  }
}

// Retry mechanism
export async function withRetry<T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
}
