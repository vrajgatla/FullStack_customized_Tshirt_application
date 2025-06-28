// Frontend validation utilities
export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (!value) return null;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (!value) return null;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  number: (value) => {
    if (!value) return null;
    if (isNaN(value) || value === '') {
      return 'Please enter a valid number';
    }
    return null;
  },

  positiveNumber: (value) => {
    const numberError = validators.number(value);
    if (numberError) return numberError;
    if (parseFloat(value) <= 0) {
      return 'Please enter a positive number';
    }
    return null;
  },

  fileSize: (maxSizeMB) => (file) => {
    if (!file) return null;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
    return null;
  },

  fileType: (allowedTypes) => (file) => {
    if (!file) return null;
    if (!allowedTypes.includes(file.type)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }
    return null;
  }
};

// Validate a form object against a schema
export const validateForm = (values, schema) => {
  const errors = {};
  
  Object.keys(schema).forEach(field => {
    const fieldValidators = schema[field];
    const value = values[field];
    
    for (const validator of fieldValidators) {
      const error = validator(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return errors;
};

// Validate a single field
export const validateField = (value, validators) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

// Common validation schemas
export const schemas = {
  login: {
    nameOrEmail: [validators.required],
    password: [validators.required]
  },
  
  signup: {
    name: [validators.required, validators.minLength(2), validators.maxLength(50)],
    email: [validators.required, validators.email],
    password: [validators.required, validators.password]
  },
  
  profile: {
    name: [validators.required, validators.minLength(2), validators.maxLength(50)],
    email: [validators.required, validators.email],
    phone: [validators.phone]
  },
  
  product: {
    name: [validators.required, validators.minLength(2), validators.maxLength(100)],
    price: [validators.required, validators.positiveNumber],
    description: [validators.maxLength(500)]
  },
  
  imageUpload: {
    file: [
      validators.required,
      validators.fileType(['image/jpeg', 'image/png', 'image/webp']),
      validators.fileSize(10) // 10MB max
    ]
  }
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  return Object.values(errors).join(', ');
}; 