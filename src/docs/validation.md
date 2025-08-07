# Form Validation with Zod + React Hook Form

This document explains how to implement robust form validation using Zod schemas with React Hook Form integration in the React Native boilerplate.

## Overview

The boilerplate uses:
- **Zod** for schema definition and validation
- **React Hook Form** for form state management
- **@hookform/resolvers** for Zod integration
- Custom hooks for error handling

## Basic Validation Setup

### 1. Define Zod Schema

```typescript
// src/validations/user.ts
import { z } from 'zod';

export const userSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
    
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
    
  age: z
    .number()
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Invalid age'),
    
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
    .optional(),
});

// Export inferred type
export type UserFormData = z.infer<typeof userSchema>;
```

### 2. Use in React Hook Form

```typescript
// UserForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserFormData } from '@/validations/user';

export default function UserForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: 'onBlur', // Validate on blur
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
      phone: '',
    },
  });

  const onSubmit = (data: UserFormData) => {
    console.log('Valid form data:', data);
  };

  return (
    <View>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="First Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstName?.message}
            required
          />
        )}
      />
      
      {/* Other form fields... */}
      
      <Button
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
      />
    </View>
  );
}
```

## Advanced Validation Patterns

### 1. Conditional Validation

```typescript
// Conditional fields based on other field values
const profileSchema = z.object({
  userType: z.enum(['individual', 'business']),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  companyName: z.string().optional(),
  taxId: z.string().optional(),
}).refine((data) => {
  // Business users must provide company info
  if (data.userType === 'business') {
    return data.companyName && data.taxId;
  }
  return true;
}, {
  message: 'Company name and tax ID are required for business accounts',
  path: ['companyName'], // Error will appear on companyName field
});
```

### 2. Password Confirmation

```typescript
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

### 3. Custom Validation Functions

```typescript
// Custom email uniqueness check
const signUpSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .refine(async (email) => {
      // Check if email is available
      const isAvailable = await checkEmailAvailability(email);
      return isAvailable;
    }, 'Email is already taken'),
    
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .transform((val) => val.toLowerCase()), // Transform to lowercase
});
```

### 4. Array Validation

```typescript
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  emails: z
    .array(z.string().email('Invalid email'))
    .min(1, 'At least one email is required')
    .max(5, 'Maximum 5 emails allowed'),
    
  tags: z
    .array(z.string())
    .optional()
    .default([]),
});

// In component
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
  defaultValues: {
    name: '',
    emails: [''], // Start with one empty email
    tags: [],
  },
});
```

## Form Validation Hooks

### 1. Custom Form Error Hook

```typescript
// src/hooks/useFormErrors.ts
import { useEffect } from 'react';
import { FieldErrors, FieldValues, UseFormSetError } from 'react-hook-form';

export function useFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  serverError?: string | null
) {
  useEffect(() => {
    if (serverError) {
      // Map server errors to specific fields or general form error
      if (serverError.includes('email')) {
        setError('email' as any, {
          type: 'server',
          message: serverError,
        });
      } else {
        setError('root' as any, {
          type: 'server',
          message: serverError,
        });
      }
    }
  }, [serverError, setError]);
}

// Usage in component
const { setError } = useForm<FormData>({
  resolver: zodResolver(schema),
});

useFormErrors(setError, serverError);
```

### 2. Form Submission Hook

```typescript
// src/hooks/useFormSubmit.ts
import { useState } from 'react';
import { FieldValues, UseFormSetError } from 'react-hook-form';

interface UseFormSubmitOptions<T extends FieldValues> {
  onSubmit: (data: T) => Promise<{ error?: string }>;
  setError: UseFormSetError<T>;
}

export function useFormSubmit<T extends FieldValues>({
  onSubmit,
  setError,
}: UseFormSubmitOptions<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(data);
      
      if (result.error) {
        setError('root' as any, {
          type: 'submit',
          message: result.error,
        });
      }
    } catch (error: any) {
      setError('root' as any, {
        type: 'submit',
        message: error.message || 'Submission failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
```

## Real-World Form Examples

### 1. Registration Form

```typescript
// src/validations/auth.ts
export const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// RegistrationScreen.tsx
export default function RegistrationScreen() {
  const { signUp, isLoading } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onBlur',
  });

  useFormErrors(setError, serverError);

  const onSubmit = async (data: RegistrationFormData) => {
    setServerError(null);
    const { error } = await signUp(data);
    if (error) setServerError(error);
  };

  return (
    <ScrollView>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="First Name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.firstName?.message}
            autoCapitalize="words"
            required
          />
        )}
      />
      
      {/* Other fields... */}
      
      <Controller
        control={control}
        name="agreeToTerms"
        render={({ field: { onChange, value } }) => (
          <CheckBox
            checked={value}
            onPress={() => onChange(!value)}
            title="I agree to the Terms of Service"
            error={errors.agreeToTerms?.message}
          />
        )}
      />
      
      <Button
        title="Create Account"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
        disabled={!isValid}
      />
    </ScrollView>
  );
}
```

### 2. Dynamic Form (Add/Remove Fields)

```typescript
// Address form with dynamic fields
const addressSchema = z.object({
  addresses: z.array(z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    zipCode: z.string().min(5, 'Invalid zip code'),
    type: z.enum(['home', 'work', 'other']),
  })).min(1, 'At least one address is required'),
});

export default function AddressForm() {
  const { control, handleSubmit, watch } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      addresses: [{ street: '', city: '', zipCode: '', type: 'home' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });

  return (
    <View>
      {fields.map((field, index) => (
        <View key={field.id}>
          <Controller
            control={control}
            name={`addresses.${index}.street`}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Street Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.addresses?.[index]?.street?.message}
              />
            )}
          />
          
          {fields.length > 1 && (
            <Button
              title="Remove"
              onPress={() => remove(index)}
              variant="outline"
            />
          )}
        </View>
      ))}
      
      <Button
        title="Add Address"
        onPress={() => append({ street: '', city: '', zipCode: '', type: 'home' })}
        variant="secondary"
      />
    </View>
  );
}
```

## Validation Best Practices

### 1. Schema Organization

```typescript
// Base schemas for reusability
const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

// Compose complex schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // Less strict for sign in
});

export const signUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

### 2. Error Message Consistency

```typescript
// Create consistent error messages
const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
} as const;

// Use in schemas
const userSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  password: z.string().min(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT),
});
```

### 3. Form State Management

```typescript
// Custom hook for form state
export function useFormState<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  defaultValues?: Partial<T>
) {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues,
  });

  useFormErrors(form.setError, serverError);

  const clearServerError = () => setServerError(null);

  return {
    ...form,
    serverError,
    setServerError,
    clearServerError,
  };
}

// Usage
const formState = useFormState(signUpSchema, {
  firstName: '',
  lastName: '',
  email: '',
});
```

### 4. Accessibility and UX

```typescript
// Enhanced Input component with accessibility
const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, required, ...props }, ref) => {
    const inputId = useId();
    const errorId = `${inputId}-error`;
    
    return (
      <View>
        <Text
          nativeID={`${inputId}-label`}
          style={styles.label}
        >
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        
        <TextInput
          ref={ref}
          nativeID={inputId}
          accessibilityLabelledBy={`${inputId}-label`}
          accessibilityDescribedBy={error ? errorId : undefined}
          accessibilityInvalid={!!error}
          style={[styles.input, error && styles.inputError]}
          {...props}
        />
        
        {error && (
          <Text
            nativeID={errorId}
            style={styles.errorText}
            accessibilityRole="alert"
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);
```

## Testing Form Validation

### 1. Schema Testing

```typescript
// userSchema.test.ts
import { userSchema } from '@/validations/user';

describe('User Schema Validation', () => {
  it('should validate correct user data', () => {
    const validData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      age: 25,
    };
    
    const result = userSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      age: 25,
    };
    
    const result = userSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['email']);
      expect(result.error.issues[0].message).toContain('valid email');
    }
  });
});
```

### 2. Form Testing

```typescript
// UserForm.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserForm from '@/components/UserForm';

describe('UserForm', () => {
  it('should show validation errors for invalid input', async () => {
    const { getByLabelText, getByText } = render(<UserForm />);
    
    const emailInput = getByLabelText('Email');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent(emailInput, 'blur');
    
    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('should submit valid form data', async () => {
    const mockSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <UserForm onSubmit={mockSubmit} />
    );
    
    fireEvent.changeText(getByLabelText('First Name'), 'John');
    fireEvent.changeText(getByLabelText('Last Name'), 'Doe');
    fireEvent.changeText(getByLabelText('Email'), 'john@example.com');
    
    fireEvent.press(getByText('Submit'));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
    });
  });
});
```

This validation system provides type safety, excellent user experience, and maintainable form handling throughout your React Native application.