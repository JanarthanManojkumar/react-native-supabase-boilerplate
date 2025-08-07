import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Container, Button } from '@/components';
import { useAuthStore } from '@/store';
import { COLORS, SIZES } from '@/utils';

interface SettingItem {
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export default function SettingsScreen() {
  const { signOut, user } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Not Implemented', 'Account deletion is not implemented yet.');
          }
        },
      ]
    );
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen or implement modal
    Alert.alert('Not Implemented', 'Change password feature is not implemented yet.');
  };

  const handleExportData = () => {
    // TODO: Implement data export
    Alert.alert('Not Implemented', 'Data export feature is not implemented yet.');
  };

  const handlePrivacyPolicy = () => {
    // TODO: Navigate to privacy policy or open web view
    Alert.alert('Privacy Policy', 'This would open the privacy policy.');
  };

  const handleTermsOfService = () => {
    // TODO: Navigate to terms of service or open web view
    Alert.alert('Terms of Service', 'This would open the terms of service.');
  };

  const accountSettings: SettingItem[] = [
    {
      title: 'Change Password',
      subtitle: 'Update your account password',
      onPress: handleChangePassword,
    },
    {
      title: 'Export Data',
      subtitle: 'Download your account data',
      onPress: handleExportData,
    },
  ];

  const legalSettings: SettingItem[] = [
    {
      title: 'Privacy Policy',
      onPress: handlePrivacyPolicy,
    },
    {
      title: 'Terms of Service',
      onPress: handleTermsOfService,
    },
  ];

  const dangerousSettings: SettingItem[] = [
    {
      title: 'Delete Account',
      subtitle: 'Permanently delete your account and data',
      onPress: handleDeleteAccount,
      isDestructive: true,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, item.isDestructive && styles.destructiveText]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account and preferences</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            {accountSettings.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.sectionContent}>
            {legalSettings.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.sectionContent}>
            {dangerousSettings.map(renderSettingItem)}
          </View>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>App Version: 1.0.0</Text>
          <Text style={styles.appInfoText}>
            User ID: {user?.id?.slice(0, 8)}...
          </Text>
        </View>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
        />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: SIZES.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  title: {
    fontSize: SIZES.font2xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  sectionContent: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
  },
  settingItem: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSecondary,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: SIZES.fontMd,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingSubtitle: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  destructiveText: {
    color: COLORS.error,
  },
  appInfo: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  appInfoText: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  signOutButton: {
    marginTop: SIZES.md,
  },
});