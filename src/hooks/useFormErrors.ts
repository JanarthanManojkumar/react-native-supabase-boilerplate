import { useEffect } from 'react';
import { FieldErrors, FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * Custom hook to handle server-side form errors
 */
export function useFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  serverError?: string | null
) {
  useEffect(() => {
    if (serverError) {
      // Try to parse server error and map to specific fields
      if (serverError.toLowerCase().includes('email')) {
        setError('email' as any, {
          type: 'server',
          message: serverError,
        });
      } else if (serverError.toLowerCase().includes('password')) {
        setError('password' as any, {
          type: 'server',
          message: serverError,
        });
      } else {
        // Set a general form error
        setError('root' as any, {
          type: 'server',
          message: serverError,
        });
      }
    }
  }, [serverError, setError]);
}

/**
 * Extract the first error message from form errors
 */
export function getFirstError(errors: FieldErrors): string | null {
  const keys = Object.keys(errors);
  if (keys.length === 0) return null;
  
  const firstKey = keys[0];
  const error = errors[firstKey];
  
  if (error && typeof error.message === 'string') {
    return error.message;
  }
  
  return null;
}