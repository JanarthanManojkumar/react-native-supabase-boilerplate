# Setup Instructions

This guide will help you set up and run the React Native boilerplate with Supabase, Zustand, Zod, and React Hook Form.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **React Native CLI** globally installed
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

## Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd react-native-scalable-boilerplate

# Install dependencies
npm install

# For iOS only - install CocoaPods dependencies
cd ios && pod install && cd ..
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account
2. Create a new project
3. Go to **Settings > API** to find your credentials

#### Configure Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

#### Update Supabase Configuration

Update the Supabase configuration in `src/services/supabase.ts`:

```typescript
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
```

#### Set Up Authentication Tables (Optional)

If you want to customize user profiles, you can set up additional tables in Supabase:

```sql
-- Create a profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 3. Metro Configuration

The project uses path mapping for clean imports. Ensure your `babel.config.js` includes the module resolver:

```javascript
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
```

### 4. Additional Dependencies (if needed)

If you want to add icons, install react-native-vector-icons:

```bash
npm install react-native-vector-icons
npx react-native link react-native-vector-icons
```

For iOS, you may need to add fonts to your `Info.plist`:

```xml
<key>UIAppFonts</key>
<array>
  <string>AntDesign.ttf</string>
  <string>Entypo.ttf</string>
  <string>EvilIcons.ttf</string>
  <string>Feather.ttf</string>
  <string>FontAwesome.ttf</string>
  <string>Foundation.ttf</string>
  <string>Ionicons.ttf</string>
  <string>MaterialIcons.ttf</string>
  <string>MaterialCommunityIcons.ttf</string>
  <string>SimpleLineIcons.ttf</string>
  <string>Octicons.ttf</string>
  <string>Zocial.ttf</string>
</array>
```

## Running the App

### Development Mode

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Production Build

```bash
# Android
cd android
./gradlew assembleRelease

# iOS
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -archivePath YourApp.xcarchive archive
```

## Project Configuration

### TypeScript Configuration

The project uses strict TypeScript settings for better type safety. Key configurations in `tsconfig.json`:

- Path mapping for clean imports
- Strict type checking enabled
- NoImplicitAny and strict null checks

### ESLint and Prettier

Configure your editor to use the included ESLint and Prettier configurations for consistent code formatting.

### Testing Setup (Optional)

To add testing capabilities:

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
```

Create `__tests__` folders and add your test files.

## Environment Configurations

### Development Environment

Create `.env.development`:

```env
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_ANON_KEY=your-dev-anon-key
```

### Production Environment

Create `.env.production`:

```env
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
```

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues:**
   ```bash
   npm run reset-cache
   ```

2. **iOS build issues:**
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

3. **Android build issues:**
   ```bash
   npm run clean
   npm run android
   ```

4. **Path mapping not working:**
   - Ensure `babel.config.js` has the module resolver plugin
   - Restart Metro bundler
   - Clear cache

### Environment Variable Issues

If environment variables aren't loading:

1. Install `react-native-config`:
   ```bash
   npm install react-native-config
   ```

2. Update your configuration to use react-native-config instead of process.env

### Supabase Connection Issues

1. Verify your Supabase URL and anon key
2. Check your network connection
3. Ensure your Supabase project is active
4. Check the Supabase logs for any errors

## Next Steps

After successful setup:

1. **Configure Supabase policies** for your data tables
2. **Customize the UI components** to match your design
3. **Add your business logic** and API integrations
4. **Set up CI/CD pipelines** for automated builds
5. **Configure app store deployment** settings

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form Documentation](https://react-hook-form.com/)

For additional help, check the project's README or create an issue in the repository.