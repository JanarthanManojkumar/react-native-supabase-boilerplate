# State Management with Zustand

This document explains how to use Zustand for state management in the React Native boilerplate and provides best practices for scaling your application.

## Overview

Zustand is a small, fast, and scalable state management solution. It's simpler than Redux but more powerful than React's built-in state management.

## Basic Store Structure

### Creating a Store

```typescript
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyState {
  // State properties
  count: number;
  user: User | null;
  
  // Actions
  increment: () => void;
  setUser: (user: User) => void;
  reset: () => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set, get) => ({
      // Initial state
      count: 0,
      user: null,
      
      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      setUser: (user) => set({ user }),
      reset: () => set({ count: 0, user: null }),
    }),
    {
      name: 'my-store', // unique name for AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist specific fields
        user: state.user,
      }),
    }
  )
);
```

## Authentication Store Example

The boilerplate includes a complete authentication store:

```typescript
// src/store/authStore.ts
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      signIn: async (credentials) => {
        set({ isLoading: true });
        // ... authentication logic
      },
      
      signOut: async () => {
        // ... sign out logic
        set({ user: null, session: null, isAuthenticated: false });
      },
      
      // ... other actions
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

## Using Stores in Components

### Basic Usage

```typescript
import React from 'react';
import { useAuthStore } from '@/store';

function MyComponent() {
  // Select specific state and actions
  const { user, isLoading, signOut } = useAuthStore();
  
  // Or use selectors for better performance
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  
  return (
    <View>
      <Text>Welcome {user?.email}</Text>
      <Button onPress={signOut} title="Sign Out" />
    </View>
  );
}
```

### Advanced Selectors

```typescript
// Use selectors to prevent unnecessary re-renders
const useAuthState = () => useAuthStore((state) => ({
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
}));

// In component
function MyComponent() {
  const { isAuthenticated, isLoading } = useAuthState();
  // Component only re-renders when these specific values change
}
```

## Store Patterns and Best Practices

### 1. Async Actions Pattern

```typescript
interface ApiState {
  data: any[];
  loading: boolean;
  error: string | null;
  
  fetchData: () => Promise<void>;
  clearError: () => void;
}

export const useApiStore = create<ApiState>((set, get) => ({
  data: [],
  loading: false,
  error: null,
  
  fetchData: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getData();
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false 
      });
    }
  },
  
  clearError: () => set({ error: null }),
}));
```

### 2. Immer for Complex State Updates

For complex nested state updates, use Immer:

```bash
npm install immer
```

```typescript
import { immer } from 'zustand/middleware/immer';

interface ComplexState {
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
}

export const useComplexStore = create<ComplexState>()(
  immer((set) => ({
    users: [],
    
    updateUser: (id, updates) => set((state) => {
      const user = state.users.find(u => u.id === id);
      if (user) {
        Object.assign(user, updates);
      }
    }),
  }))
);
```

### 3. Store Slicing Pattern

For large applications, slice your stores by domain:

```typescript
// userSlice.ts
export interface UserSlice {
  users: User[];
  selectedUser: User | null;
  setUsers: (users: User[]) => void;
  selectUser: (user: User) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  users: [],
  selectedUser: null,
  setUsers: (users) => set({ users }),
  selectUser: (user) => set({ selectedUser: user }),
});

// settingsSlice.ts
export interface SettingsSlice {
  theme: 'light' | 'dark';
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleNotifications: () => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  theme: 'light',
  notifications: true,
  setTheme: (theme) => set({ theme }),
  toggleNotifications: () => set((state) => ({ 
    notifications: !state.notifications 
  })),
});

// Combined store
type AppState = UserSlice & SettingsSlice;

export const useAppStore = create<AppState>()((...a) => ({
  ...createUserSlice(...a),
  ...createSettingsSlice(...a),
}));
```

## Persistence Strategies

### 1. Selective Persistence

```typescript
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        theme: state.theme,
        // Don't persist loading states or temporary data
      }),
    }
  )
);
```

### 2. Custom Storage

```typescript
import { createJSONStorage } from 'zustand/middleware';
import EncryptedStorage from 'react-native-encrypted-storage';

// For sensitive data
const secureStorage = {
  getItem: async (name: string) => {
    const value = await EncryptedStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name: string, value: any) => {
    await EncryptedStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await EncryptedStorage.removeItem(name);
  },
};

export const useSecureStore = create<SecureState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'secure-store',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
```

## Testing Stores

### 1. Unit Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthStore } from '@/store/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.getState().reset();
  });

  it('should sign in user', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.signIn({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeDefined();
  });
});
```

### 2. Mocking External Dependencies

```typescript
// Mock Supabase for testing
jest.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));
```

## Performance Optimization

### 1. Use Selectors

```typescript
// ❌ Bad - Component re-renders on any store change
const state = useStore();

// ✅ Good - Component only re-renders when count changes
const count = useStore((state) => state.count);
```

### 2. Combine Related State Updates

```typescript
// ❌ Bad - Multiple re-renders
set({ loading: true });
set({ error: null });
set({ data: newData });

// ✅ Good - Single re-render
set({ 
  loading: false, 
  error: null, 
  data: newData 
});
```

### 3. Use Shallow Comparison for Objects

```typescript
import { shallow } from 'zustand/shallow';

const { user, settings } = useStore(
  (state) => ({ user: state.user, settings: state.settings }),
  shallow
);
```

## Store Architecture Guidelines

### 1. Single Responsibility

Each store should handle one domain or feature:

```typescript
// ✅ Good
useAuthStore()     // Authentication
useUserStore()     // User data
useSettingsStore() // App settings

// ❌ Bad
useEverythingStore() // Authentication + User data + Settings + etc.
```

### 2. Action Naming Conventions

```typescript
// Use descriptive action names
interface UserStore {
  // Getters (computed values)
  get fullName(): string;
  
  // Setters
  setUser: (user: User) => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Async actions
  fetchUser: () => Promise<void>;
  saveUser: () => Promise<void>;
  
  // Boolean toggles
  toggleNotifications: () => void;
  
  // Reset/Clear actions
  clearError: () => void;
  resetStore: () => void;
}
```

### 3. Error Handling

```typescript
interface StoreWithError {
  error: string | null;
  isLoading: boolean;
  
  clearError: () => void;
  
  someAsyncAction: () => Promise<void>;
}

export const useMyStore = create<StoreWithError>((set) => ({
  error: null,
  isLoading: false,
  
  clearError: () => set({ error: null }),
  
  someAsyncAction: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // ... async operation
      set({ isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error.message || 'An error occurred' 
      });
    }
  },
}));
```

## Common Patterns

### 1. Loading States

```typescript
interface LoadingStates {
  isLoading: boolean;
  isSubmitting: boolean;
  isRefreshing: boolean;
}
```

### 2. Optimistic Updates

```typescript
const updateItem = async (id: string, updates: Partial<Item>) => {
  // Optimistically update UI
  set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  }));
  
  try {
    await api.updateItem(id, updates);
    // Update with server response if needed
  } catch (error) {
    // Revert optimistic update
    set((state) => ({
      items: state.items.map(item => 
        item.id === id ? originalItem : item
      )
    }));
    throw error;
  }
};
```

This state management pattern provides a solid foundation for building scalable React Native applications with predictable state updates and excellent developer experience.