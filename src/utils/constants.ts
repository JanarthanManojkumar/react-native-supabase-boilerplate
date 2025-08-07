export const COLORS = {
  primary: '#007AFF',
  secondary: '#F2F2F7',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Text colors
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  
  // Border colors
  border: '#D1D1D6',
  borderSecondary: '#E5E5EA',
} as const;

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  
  // Font sizes
  fontXs: 12,
  fontSm: 14,
  fontMd: 16,
  fontLg: 18,
  fontXl: 20,
  font2xl: 24,
  font3xl: 32,
  
  // Border radius
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
} as const;