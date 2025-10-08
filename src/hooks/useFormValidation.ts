import { useState, useCallback } from 'react';
import { ValidationRule } from '@/utils/validation';

type FieldErrors<T> = Partial<Record<keyof T, string>>;
type ValidationRules<T> = Partial<Record<keyof T, ValidationRule[]>>;

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const validateField = useCallback((field: keyof T, value: any) => {
    const fieldRules = rules[field];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        setErrors(prev => ({ ...prev, [field]: rule.message }));
        return false;
      }
    }

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    return true;
  }, [rules]);

  const validateAll = useCallback(() => {
    const newErrors: FieldErrors<T> = {};
    let isValid = true;

    Object.keys(rules).forEach((key) => {
      const field = key as keyof T;
      const fieldRules = rules[field];
      const value = values[field];

      if (fieldRules) {
        for (const rule of fieldRules) {
          if (!rule.validate(value)) {
            newErrors[field] = rule.message;
            isValid = false;
            break;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  };
};