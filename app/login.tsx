import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Missing Details', 'Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));
    const success = login(email.trim(), password);
    setLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      showAlert('Login Failed', 'Incorrect email or password. Try demo: alex@supertrack.com.au / 123456');
    }
  };

  const fillDemo = () => {
    setEmail('alex@supertrack.com.au');
    setPassword('123456');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.Background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + Spacing.xl, paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.TextSecondary} />
        </Pressable>

        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoMark}>
            <Text style={styles.logoMarkText}>ST</Text>
          </View>
          <Text style={styles.logoTitle}>SuperTrack</Text>
          <Text style={styles.logoSub}>Tax & Super Management for Sole Traders</Text>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabs}>
          {(['login', 'signup'] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* MOCK indicator */}
        <Pressable style={styles.mockBanner} onPress={fillDemo}>
          <MaterialIcons name="info-outline" size={15} color={Colors.Gold} />
          <Text style={styles.mockText}>
            DEMO MODE — Tap to fill demo credentials
          </Text>
        </Pressable>

        {/* Form */}
        <View style={styles.form}>
          {activeTab === 'signup' && (
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrap}>
                <MaterialIcons name="person-outline" size={18} color={Colors.TextMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Alex Thompson"
                  placeholderTextColor={Colors.TextMuted}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="mail-outline" size={18} color={Colors.TextMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com.au"
                placeholderTextColor={Colors.TextMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrap}>
              <MaterialIcons name="lock-outline" size={18} color={Colors.TextMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.TextMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={18}
                  color={Colors.TextMuted}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
              loading && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'Signing in...' : activeTab === 'login' ? 'Sign In' : 'Create Account'}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to SuperTrack{`'`}s{'\n'}
          Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoMarkText: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.ExtraBold,
    color: Colors.TextInverse,
    letterSpacing: 1,
  },
  logoTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.ExtraBold,
    color: Colors.TextPrimary,
    letterSpacing: -0.3,
  },
  logoSub: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.Surface,
    borderRadius: Radius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: {
    backgroundColor: Colors.Primary,
  },
  tabText: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
  },
  tabTextActive: {
    color: Colors.TextInverse,
  },
  mockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.GoldMuted,
    borderWidth: 1,
    borderColor: Colors.Gold,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  mockText: {
    fontSize: Typography.xs,
    color: Colors.Gold,
    fontWeight: Typography.SemiBold,
  },
  form: {
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextSecondary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.Surface,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: Typography.base,
    color: Colors.TextPrimary,
  },
  eyeBtn: {
    padding: Spacing.sm,
  },
  submitBtn: {
    backgroundColor: Colors.Primary,
    paddingVertical: 17,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  submitText: {
    fontSize: Typography.lg,
    fontWeight: Typography.Bold,
    color: Colors.TextInverse,
  },
  footerText: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    lineHeight: 18,
  },
});
