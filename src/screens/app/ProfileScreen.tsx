import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Container, Button, Input } from '@/components';
import { useAuthStore } from '@/store';
import { updateProfileSchema, type UpdateProfileFormData } from '@/validations';
import { useFormErrors } from '@/hooks';
import { COLORS, SIZES } from '@/utils';

export default function ProfileScreen() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || '',
      lastName: user?.user_metadata?.last_name || '',
      email: user?.email || '',
    },
  });

  useFormErrors(setError, serverError);

  const onSubmit = async (data: UpdateProfileFormData) => {
    setServerError(null);
    
    const { error } = await updateProfile({
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    });
    
    if (error) {
      setServerError(error);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Update your profile information</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="First Name"
                placeholder="Enter your first name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                autoCapitalize="words"
                textContentType="givenName"
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                autoCapitalize="words"
                textContentType="familyName"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value } }) => (
              <Input
                label="Email"
                placeholder="Your email address"
                value={value}
                editable={false}
                style={styles.disabledInput}
              />
            )}
          />

          {serverError && (
            <Text style={styles.errorText}>{serverError}</Text>
          )}

          <Button
            title="Update Profile"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={!isDirty}
            style={styles.updateButton}
          />
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue}>{user?.id}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Sign In:</Text>
              <Text style={styles.infoValue}>
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
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
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SIZES.xl,
  },
  disabledInput: {
    backgroundColor: COLORS.backgroundSecondary,
    color: COLORS.textSecondary,
  },
  updateButton: {
    marginTop: SIZES.md,
  },
  errorText: {
    fontSize: SIZES.fontSm,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  infoSection: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
  },
  infoTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.sm,
  },
  infoLabel: {
    fontSize: SIZES.fontMd,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: SIZES.fontMd,
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});