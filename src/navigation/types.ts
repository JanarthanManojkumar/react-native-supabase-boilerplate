import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Navigation Types
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// App Stack Navigation Types
export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Root Stack Navigation Types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  Loading: undefined;
};

// Declare global types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}