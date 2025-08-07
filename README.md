# React Native CLI + Supabase + Zustand + Zod + React Hook Form – Scalable Boilerplate

A production-ready React Native CLI boilerplate with modern development tools and best practices.

## 🚀 Tech Stack

- **React Native CLI** - Native app development without Expo restrictions
- **Supabase** - Backend as a service with authentication and database
- **Zustand** - Lightweight state management with persistence
- **Zod** - TypeScript-first schema validation
- **React Hook Form** - Performant forms with easy validation
- **React Navigation v6** - Type-safe navigation
- **TypeScript** - Full type safety and better developer experience

## ✨ Features

- 🔐 **Complete Authentication Flow** - Sign up, sign in, forgot password with Supabase
- 🎯 **Type-Safe Architecture** - Full TypeScript coverage with strict settings
- 📱 **Production-Ready Components** - Reusable UI components with accessibility
- 🔄 **State Management** - Zustand with persistence and async actions
- ✅ **Form Validation** - Zod schemas integrated with React Hook Form
- 🧭 **Navigation** - Stack and tab navigation with type safety
- 📖 **Comprehensive Documentation** - Detailed guides for all patterns
- 🛠️ **Developer Experience** - Path mapping, ESLint, Prettier configured

## 📁 Project Structure

```
/src
├── /components         # Reusable UI components
│   ├── /common         # Basic components (Button, Input, Container)
│   └── index.ts        # Component exports
├── /screens            # App screens organized by feature
│   ├── /auth           # Authentication screens
│   ├── /app            # Main app screens
│   └── LoadingScreen.tsx
├── /services           # Supabase client and API functions
│   ├── supabase.ts     # Supabase configuration
│   └── auth.ts         # Authentication service
├── /store              # Zustand state stores
│   ├── authStore.ts    # Authentication state
│   └── index.ts        # Store exports
├── /navigation         # React Navigation setup
│   ├── types.ts        # Navigation types
│   ├── AuthStack.tsx   # Auth flow navigation
│   ├── AppStack.tsx    # Main app navigation
│   └── RootNavigator.tsx
├── /hooks              # Custom React hooks
│   ├── useFormErrors.ts
│   └── index.ts
├── /utils              # Utility functions and constants
│   ├── constants.ts    # Colors, sizes, fonts
│   └── index.ts
├── /types              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   └── index.ts
├── /validations        # Zod schema definitions
│   ├── auth.ts         # Auth form schemas
│   └── index.ts
└── /docs               # Project documentation
    ├── project-structure.md
    ├── setup.md
    ├── state-management.md
    └── validation.md
```

## 🛠️ Quick Start

### 1. Prerequisites

- Node.js (v18 or later)
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS - macOS only)

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react-native-scalable-boilerplate

# Install dependencies
npm install

# For iOS only
cd ios && pod install && cd ..
```

### 3. Supabase Setup

1. Create a [Supabase](https://supabase.com) project
2. Get your project URL and anon key from Settings > API
3. Update `src/services/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

### 4. Run the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## 📚 Documentation

- **[Project Structure](src/docs/project-structure.md)** - Detailed folder organization and conventions
- **[Setup Guide](src/docs/setup.md)** - Complete setup and configuration instructions
- **[State Management](src/docs/state-management.md)** - Zustand patterns and best practices
- **[Form Validation](src/docs/validation.md)** - Zod + React Hook Form integration guide

## 🎯 Key Patterns

### Authentication with Supabase

```typescript
// Sign in with email and password
const { signIn, isLoading } = useAuthStore();
const { error } = await signIn({ email, password });
```

### Form Validation with Zod

```typescript
// Define schema
const signUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
});

// Use with React Hook Form
const { control, handleSubmit } = useForm({
  resolver: zodResolver(signUpSchema),
});
```

### State Management with Zustand

```typescript
// Create store
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: async (credentials) => {
        // Authentication logic
      },
    }),
    { name: 'auth-store' }
  )
);
```

### Type-Safe Navigation

```typescript
// Define navigation types
type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

// Use in components
const navigation = useNavigation<NavigationProp>();
navigation.navigate('Profile');
```

## 🏗️ Architecture Highlights

### Component Architecture
- **Atomic Design** - Components organized from basic to complex
- **Composition over Inheritance** - Flexible, reusable components
- **Accessibility First** - WCAG compliant components

### State Management
- **Single Source of Truth** - Centralized state with Zustand
- **Optimistic Updates** - Better UX with immediate feedback
- **Persistence** - Important state survives app restarts

### Form Handling
- **Schema-First Validation** - Type-safe forms with Zod
- **Server Error Integration** - Unified client and server validation
- **Performance Optimized** - Minimal re-renders with React Hook Form

### Type Safety
- **Strict TypeScript** - Full type coverage with strict settings
- **Generated Types** - Inferred types from Zod schemas
- **Navigation Types** - Type-safe routing and parameters

## 🧪 Scripts

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS

# Code Quality
npm run lint          # Run ESLint
npm run typecheck     # TypeScript type checking

# Utilities
npm run clean         # Clean build artifacts
npm run reset-cache   # Reset Metro cache
npm run pod-install   # Install iOS dependencies
```

## 📦 Dependencies

### Core
- `react-native` - React Native framework
- `@react-navigation/native` - Navigation library
- `@supabase/supabase-js` - Supabase client
- `zustand` - State management
- `zod` - Schema validation
- `react-hook-form` - Form library

### Development
- `typescript` - Type safety
- `@react-native/eslint-config` - Linting
- `prettier` - Code formatting
- `babel-plugin-module-resolver` - Path mapping

## 🔒 Security Features

- **Environment Variables** - Secure credential management
- **Input Validation** - Client and server-side validation
- **Authentication Flow** - Secure token-based auth
- **Error Handling** - Safe error messages without data leaks

## 🎨 UI/UX Features

- **Consistent Design** - Design system with colors, fonts, spacing
- **Responsive Layout** - Adapts to different screen sizes
- **Accessibility** - Screen reader support and proper labeling
- **Loading States** - User feedback during async operations
- **Error Boundaries** - Graceful error handling

## 🚀 Deployment

### Android

```bash
cd android
./gradlew assembleRelease
```

### iOS

```bash
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -archivePath YourApp.xcarchive archive
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/) - Mobile app framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Zod](https://zod.dev/) - Schema validation
- [React Hook Form](https://react-hook-form.com/) - Form management

---

**Happy coding!** 🎉

For questions or support, please check the [documentation](src/docs/) or open an issue.