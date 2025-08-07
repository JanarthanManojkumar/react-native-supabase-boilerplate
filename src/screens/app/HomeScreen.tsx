import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Container, Button } from '@/components';
import { useAuthStore } from '@/store';
import { COLORS, SIZES } from '@/utils';

export default function HomeScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Home!</Text>
          <Text style={styles.subtitle}>
            Hello {user?.user_metadata?.first_name || user?.email}!
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎉 You're all set!</Text>
            <Text style={styles.cardDescription}>
              Your React Native app with Supabase, Zustand, Zod, and React Hook Form is ready to go.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📱 What's included:</Text>
            <Text style={styles.cardItem}>• Authentication with Supabase</Text>
            <Text style={styles.cardItem}>• State management with Zustand</Text>
            <Text style={styles.cardItem}>• Form validation with Zod</Text>
            <Text style={styles.cardItem}>• React Hook Form integration</Text>
            <Text style={styles.cardItem}>• Type-safe navigation</Text>
            <Text style={styles.cardItem}>• Reusable UI components</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚀 Next steps:</Text>
            <Text style={styles.cardItem}>• Add your Supabase credentials</Text>
            <Text style={styles.cardItem}>• Customize the UI components</Text>
            <Text style={styles.cardItem}>• Add your business logic</Text>
            <Text style={styles.cardItem}>• Deploy to App Store/Play Store</Text>
          </View>

          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
          />
        </View>
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
    fontSize: SIZES.fontLg,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  cardTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  cardDescription: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  cardItem: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
    lineHeight: 20,
  },
  signOutButton: {
    marginTop: SIZES.lg,
  },
});