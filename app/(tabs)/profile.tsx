import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '@/constants/theme';
import { useApp } from '@/hooks/useApp';
import { useAlert } from '@/template';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, allocationSettings, updateAllocationSettings } = useApp();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/');
        },
      },
    ]);
  };

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: 'person-outline', label: 'Personal Details', sub: user.name, route: '/settings' },
        { icon: 'business', label: 'ABN & Business Info', sub: user.abn, route: '/settings' },
        { icon: 'account-balance', label: 'Super Fund', sub: user.superFund, route: '/settings' },
      ],
    },
    {
      section: 'Allocations',
      items: [
        {
          icon: 'savings',
          label: 'Super Contribution Rate',
          sub: `${(allocationSettings.superRate * 100).toFixed(1)}% per payment`,
          route: '/settings',
          color: Colors.Super,
        },
        {
          icon: 'receipt',
          label: 'GST Registration',
          sub: allocationSettings.enableGST ? 'Active — 10% GST' : 'Not registered',
          route: '/settings',
          color: Colors.GST,
          toggle: allocationSettings.enableGST,
          onToggle: () => updateAllocationSettings({ enableGST: !allocationSettings.enableGST }),
        },
        {
          icon: 'school',
          label: 'HELP / HECS Debt',
          sub: allocationSettings.enableStudentLoan ? `${(allocationSettings.studentLoanRate * 100).toFixed(0)}% repayment` : 'Not applicable',
          route: '/settings',
          color: Colors.StudentLoan,
          toggle: allocationSettings.enableStudentLoan,
          onToggle: () => updateAllocationSettings({ enableStudentLoan: !allocationSettings.enableStudentLoan }),
        },
      ],
    },
    {
      section: 'Subscription',
      items: [
        {
          icon: 'workspace-premium',
          label: 'Current Plan',
          sub: user.plan === 'free' ? 'Free Plan' : user.plan === 'monthly' ? 'Pro Monthly — $19.99/mo' : 'Pro Annual — $159/yr',
          route: '/pricing',
          color: Colors.Gold,
        },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: 'help-outline', label: 'Help & FAQ', sub: 'Common questions answered', route: '/settings' },
        { icon: 'policy', label: 'Privacy Policy', sub: 'How we use your data', route: '/settings' },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={styles.planBadge}>
          <MaterialIcons name="workspace-premium" size={12} color={Colors.Gold} />
          <Text style={styles.planText}>
            {user.plan === 'free' ? 'Free' : 'Pro'}
          </Text>
        </View>
      </View>

      {/* ABN Card */}
      <View style={styles.abnCard}>
        <View style={styles.abnItem}>
          <Text style={styles.abnLabel}>ABN</Text>
          <Text style={styles.abnValue}>{user.abn}</Text>
        </View>
        <View style={styles.abnDivider} />
        <View style={styles.abnItem}>
          <Text style={styles.abnLabel}>Business Type</Text>
          <Text style={styles.abnValue}>Sole Trader</Text>
        </View>
        <View style={styles.abnDivider} />
        <View style={styles.abnItem}>
          <Text style={styles.abnLabel}>Member Since</Text>
          <Text style={styles.abnValue}>
            {new Date(user.joinDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      {menuItems.map((section) => (
        <View key={section.section} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.section}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item: any, idx) => (
              <Pressable
                key={item.label}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { opacity: 0.75 },
                  idx < section.items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onToggle || (() => item.route && router.push(item.route))}
              >
                <View style={[styles.menuIcon, { backgroundColor: (item.color || Colors.Primary) + '22' }]}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={18}
                    color={item.color || Colors.Primary}
                  />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
                {item.toggle !== undefined ? (
                  <View style={[styles.toggle, item.toggle && styles.toggleOn]}>
                    <View style={[styles.toggleThumb, item.toggle && styles.toggleThumbOn]} />
                  </View>
                ) : (
                  <MaterialIcons name="chevron-right" size={18} color={Colors.TextMuted} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Sign out */}
      <Pressable
        style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.8 }]}
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={18} color={Colors.Danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      <Text style={styles.versionText}>SuperTrack v1.0.0 · Australia</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  content: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.Primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: Typography.xl,
    fontWeight: Typography.ExtraBold,
    color: Colors.TextInverse,
  },
  userName: {
    fontSize: Typography.xl,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
  },
  userEmail: {
    fontSize: Typography.sm,
    color: Colors.TextMuted,
    marginTop: 2,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: Colors.GoldMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.Gold,
  },
  planText: {
    fontSize: Typography.xs,
    fontWeight: Typography.Bold,
    color: Colors.Gold,
  },
  abnCard: {
    flexDirection: 'row',
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    padding: Spacing.md,
  },
  abnItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  abnLabel: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
    fontWeight: Typography.Medium,
  },
  abnValue: {
    fontSize: Typography.sm,
    fontWeight: Typography.Bold,
    color: Colors.TextPrimary,
    textAlign: 'center',
  },
  abnDivider: {
    width: 1,
    backgroundColor: Colors.SurfaceBorder,
    marginVertical: 4,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.xs,
    fontWeight: Typography.SemiBold,
    color: Colors.TextMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: Colors.Surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.SurfaceBorder,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.SurfaceBorder,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
    gap: 3,
  },
  menuLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.SemiBold,
    color: Colors.TextPrimary,
  },
  menuSub: {
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.SurfaceBorder,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: Colors.Primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.TextMuted,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    backgroundColor: Colors.TextInverse,
    alignSelf: 'flex-end',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.DangerMuted,
    borderWidth: 1,
    borderColor: Colors.Danger + '44',
    borderRadius: Radius.lg,
    paddingVertical: 14,
  },
  signOutText: {
    fontSize: Typography.base,
    fontWeight: Typography.SemiBold,
    color: Colors.Danger,
  },
  versionText: {
    textAlign: 'center',
    fontSize: Typography.xs,
    color: Colors.TextMuted,
  },
});
