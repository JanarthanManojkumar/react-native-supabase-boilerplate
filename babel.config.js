module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/store': './src/store',
          '@/navigation': './src/navigation',
          '@/hooks': './src/hooks',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/validations': './src/validations',
        },
      },
    ],
  ],
};