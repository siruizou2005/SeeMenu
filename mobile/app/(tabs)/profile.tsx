import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import C from '../../src/theme';
import Ico from '../../src/components/Icons';
import { useApp } from '../../src/context/AppContext';
import { t } from '../../src/i18n';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, history, uiLang } = useApp();
  const s = t(uiLang);

  const avatarChar = user?.username?.[0]?.toUpperCase() ?? '?';

  const MENU_ITEMS = [
    { k: 'history', label: s.menuHistory,      path: '/(tabs)/history' },
    { k: 'lang',    label: s.languageSetting,   path: '/settings' },
  ] as const;

  const handleLogout = () => {
    Alert.alert(s.logoutConfirm, s.logoutMsg, [
      { text: s.cancel, style: 'cancel' },
      { text: s.logoutYes, style: 'destructive', onPress: () => { logout(); router.replace('/login'); } },
    ]);
  };

  return (
    <ScrollView style={[styles.root, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <Text style={styles.title}>{s.profileTitle}</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={8}>{Ico.gear(C.ink, 18)}</Pressable>
      </View>

      <View style={styles.userCard}>
        <LinearGradient colors={[C.accent, '#FF8C42']} style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarChar}</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{user?.username ?? s.notLoggedIn}</Text>
          <Text style={styles.userSub}>{s.scansCount(history.length)}</Text>
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={[styles.stat, styles.statBorder]}>
          <Text style={styles.statNum}>{history.length}</Text>
          <Text style={styles.statLabel}>{s.scansStat}</Text>
        </View>
        <View style={[styles.stat, styles.statBorder]}>
          <Text style={styles.statNum}>{history.reduce((acc, r) => acc + r.dishCount, 0)}</Text>
          <Text style={styles.statLabel}>{s.dishesStat}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNum}>0</Text>
          <Text style={styles.statLabel}>{s.roomsStat}</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {MENU_ITEMS.map((it, i) => (
          <Pressable key={it.k} onPress={() => router.push(it.path as any)} style={({ pressed }) => [styles.menuRow, i > 0 && styles.menuRowBorder, pressed && { opacity: 0.7 }]}>
            <View style={styles.menuIcon}>
              {it.k === 'history' && Ico.clock(C.ink, 14)}
              {it.k === 'lang'    && Ico.globe(C.ink, 14)}
            </View>
            <Text style={[styles.menuRowTitle, { flex: 1 }]}>{it.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.menuCard, { marginTop: 16 }]}>
        {[s.help, s.feedback].map((label, i) => (
          <View key={label} style={[styles.menuRow, i > 0 && styles.menuRowBorder]}>
            <Text style={[styles.menuRowTitle, { flex: 1 }]}>{label}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={handleLogout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>{s.logout}</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg2 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 16, fontWeight: '700', color: C.ink },
  userCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 16, fontWeight: '600', color: C.ink },
  userSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  statsCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: 0.5, borderRightColor: C.line },
  statNum: { fontSize: 22, fontWeight: '700', color: C.ink },
  statLabel: { fontSize: 11, color: C.muted, marginTop: 2 },
  menuCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuRowBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  menuIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' },
  menuRowTitle: { fontSize: 14, color: C.ink },
  chevron: { fontSize: 16, color: C.muted2 },
  logoutBtn: { marginHorizontal: 16, marginTop: 24, height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#E53935', alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: '#E53935', fontSize: 14, fontWeight: '600' },
});
