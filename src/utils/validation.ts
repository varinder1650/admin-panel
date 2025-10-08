export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/[^\d]/g, ''));
  };
  
  export const isValidPrice = (price: string | number): boolean => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) && numPrice >= 0;
  };
  
  export const isValidStock = (stock: string | number): boolean => {
    const numStock = typeof stock === 'string' ? parseInt(stock) : stock;
    return Number.isInteger(numStock) && numStock >= 0;
  };
  
  export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' };
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'Image must be less than 5MB' };
    }
    
    return { valid: true };
  };
  
  export const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  export const isValidCouponCode = (code: string): boolean => {
    const couponRegex = /^[A-Z0-9]{4,20}$/;
    return couponRegex.test(code);
  };
  
  export interface ValidationRule<T = any> {
    validate: (value: T) => boolean;
    message: string;
  }
  
  export const createValidator = <T extends Record<string, any>>(
    rules: Partial<Record<keyof T, ValidationRule[]>>
  ) => {
    return (data: T): { valid: boolean; errors: Partial<Record<keyof T, string>> } => {
      const errors: Partial<Record<keyof T, string>> = {};
      
      Object.keys(rules).forEach((key) => {
        const fieldRules = rules[key as keyof T];
        const value = data[key as keyof T];
        
        if (fieldRules) {
          for (const rule of fieldRules) {
            if (!rule.validate(value)) {
              errors[key as keyof T] = rule.message;
              break;
            }
          }
        }
      });
      
      return {
        valid: Object.keys(errors).length === 0,
        errors,
      };
    };
  };