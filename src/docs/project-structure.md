# Project Structure

This document explains the folder structure and organization of the React Native boilerplate.

## Overview

The project follows a feature-based folder structure with clear separation of concerns:

```
/src
├── /components         # Reusable UI components
├── /screens            # App views/screens
├── /services           # Supabase client and API functions
├── /store              # Zustand state stores
├── /navigation         # React Navigation setup
├── /hooks              # Custom React hooks
├── /utils              # Utility/helper functions
├── /types              # TypeScript types/interfaces
├── /validations        # Zod schema definitions
└── /docs               # Project documentation
```

## Folder Details

### `/components`
Contains reusable UI components that can be used across multiple screens.

- **`/common`** - Basic UI components (Button, Input, Container, etc.)
- **`index.ts`** - Main export file for all components

**Example:**
```typescript
import { Button, Input, Container } from '@/components';
```

### `/screens`
Contains all screen components organized by feature:

- **`/auth`** - Authentication related screens (SignIn, SignUp, ForgotPassword)
- **`/app`** - Main app screens (Home, Profile, Settings)

**Naming Convention:**
- Use PascalCase with "Screen" suffix: `HomeScreen.tsx`
- Group related screens in subfolders

### `/services`
Contains external service integrations and API functions:

- **`supabase.ts`** - Supabase client configuration
- **`auth.ts`** - Authentication service functions
- **`index.ts`** - Main export file

**Purpose:**
- Abstract external API calls
- Provide consistent error handling
- Type-safe service functions

### `/store`
Contains Zustand state management stores:

- **`authStore.ts`** - Authentication state and actions
- **`index.ts`** - Main export file for all stores

**Pattern:**
- One store per domain/feature
- Include both state and actions
- Use persistence for important data

### `/navigation`
Contains React Navigation setup and configuration:

- **`types.ts`** - Navigation type definitions
- **`AuthStack.tsx`** - Authentication flow navigation
- **`AppStack.tsx`** - Main app navigation
- **`RootNavigator.tsx`** - Root navigation controller

**Features:**
- Type-safe navigation
- Conditional rendering based on auth state
- Stack and tab navigation

### `/hooks`
Contains custom React hooks:

- **`useFormErrors.ts`** - Form error handling
- **`index.ts`** - Main export file

**Guidelines:**
- Start with "use" prefix
- Keep hooks focused on single responsibility
- Include proper TypeScript types

### `/utils`
Contains utility functions and constants:

- **`constants.ts`** - App-wide constants (colors, sizes, fonts)
- **`index.ts`** - Main export file

**Usage:**
- Pure functions only
- No side effects
- Reusable across the app

### `/types`
Contains TypeScript type definitions:

- **`auth.ts`** - Authentication related types
- **`index.ts`** - Main export file

**Organization:**
- Group types by domain/feature
- Use interfaces for object shapes
- Export types from main index

### `/validations`
Contains Zod schema definitions for form validation:

- **`auth.ts`** - Authentication form schemas
- **`index.ts`** - Main export file

**Pattern:**
- One schema per form/data structure
- Export both schema and inferred types
- Include helpful error messages

### `/docs`
Contains project documentation:

- **`project-structure.md`** - This file
- **`setup.md`** - Setup instructions
- **`state-management.md`** - Zustand usage guide
- **`validation.md`** - Form validation guide

## Import Conventions

The project uses absolute imports with path mapping:

```typescript
// ✅ Good - Use absolute imports
import { Button } from '@/components';
import { useAuthStore } from '@/store';
import { signInSchema } from '@/validations';

// ❌ Avoid - Relative imports for cross-folder imports
import { Button } from '../../components/Button';
```

## File Naming Conventions

- **Components:** PascalCase (`Button.tsx`, `SignInScreen.tsx`)
- **Hooks:** camelCase with "use" prefix (`useFormErrors.ts`)
- **Services:** camelCase (`authService.ts`)
- **Types:** camelCase (`auth.ts`)
- **Utilities:** camelCase (`constants.ts`)

## Adding New Features

When adding new features:

1. **Create types** in `/types`
2. **Add validation schemas** in `/validations`
3. **Create services** if external APIs needed
4. **Build components** in `/components`
5. **Create screens** in `/screens`
6. **Add to navigation** if needed
7. **Create custom hooks** if reusable logic
8. **Update store** if state management needed

## Best Practices

1. **Single Responsibility:** Each file should have one clear purpose
2. **Consistent Exports:** Always use index.ts files for clean imports
3. **Type Safety:** Add TypeScript types for everything
4. **Error Handling:** Use consistent error handling patterns
5. **Code Organization:** Group related functionality together
6. **Documentation:** Update docs when adding new patterns

This structure scales well as your app grows and makes it easy for new developers to understand the codebase.