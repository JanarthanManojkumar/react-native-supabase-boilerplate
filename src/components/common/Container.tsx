import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
  safeArea?: boolean;
}

export default function Container({
  children,
  style,
  padding = true,
  safeArea = true,
}: ContainerProps) {
  const containerStyles = [
    styles.container,
    padding && styles.padding,
    style,
  ];

  if (safeArea) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={containerStyles}>{children}</View>
      </SafeAreaView>
    );
  }

  return <View style={containerStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  padding: {
    paddingHorizontal: 20,
  },
});