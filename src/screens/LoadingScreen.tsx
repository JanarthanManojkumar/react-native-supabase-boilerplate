import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Container } from '@/components';
import { COLORS, SIZES } from '@/utils';

export default function LoadingScreen() {
  return (
    <Container safeArea={false} style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Loading...</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: SIZES.md,
    fontSize: SIZES.fontLg,
    color: COLORS.textSecondary,
  },
});