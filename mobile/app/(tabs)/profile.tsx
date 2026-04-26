import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import C from '../../src/theme';
import Ico from '../../src/components/Icons';

const MENU_ITEMS = [
  { k: 'history', t: '历史菜单', sub: '最近 7 天有 3 份', path: '/history' },
  { k: 'heart',   t: '收藏夹',   sub: '23 道菜',           path: '/history' },
  { k: 'lang',    t: '语言与翻译', sub: '日语 → 中文',    path: '/settings' },
  { k: 'diet',    t: '忌口与偏好', sub: '海鲜过敏 · 不吃辣', path: '/settings' },
] as const;

const STATS = [['8', '识别次数'], ['23', '收藏菜品'], ['5', '加入房间']];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={[styles.root, { paddingTop: insets.top }]} showsVerticalScrollIndicator={false}>
      <View style={styles.topBar}>
        <Text style={styles.title}>我的</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={8}>{Ico.gear(C.ink, 18)}</Pressable>
      </View>

      <View style={styles.userCard}>
        <LinearGradient colors={[C.accent, '#FF8C42']} style={styles.avatar}>
          <Text style={styles.avatarText}>李</Text>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>李明</Text>
          <Text style={styles.userSub}>已识别 8 份菜单 · 旅日 12 天</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>

      <View style={styles.statsCard}>
        {STATS.map(([n, l], i) => (
          <View key={l} style={[styles.stat, i < 2 && styles.statBorder]}>
            <Text style={styles.statNum}>{n}</Text>
            <Text style={styles.statLabel}>{l}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuCard}>
        {MENU_ITEMS.map((it, i) => (
          <Pressable key={it.k} onPress={() => router.push(it.path as any)} style={({ pressed }) => [styles.menuRow, i > 0 && styles.menuRowBorder, pressed && { opacity: 0.7 }]}>
            <View style={styles.menuIcon}>
              {it.k === 'history' && Ico.clock(C.ink, 14)}
              {it.k === 'heart'   && Ico.heart(C.ink, 14)}
              {it.k === 'lang'    && Ico.globe(C.ink, 14)}
              {it.k === 'diet'    && Ico.alert(C.ink, 14)}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuRowTitle}>{it.t}</Text>
              <Text style={styles.menuRowSub}>{it.sub}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.menuCard, { marginTop: 16 }]}>
        {['使用帮助', '意见反馈'].map((t, i) => (
          <View key={t} style={[styles.menuRow, i > 0 && styles.menuRowBorder]}>
            <Text style={[styles.menuRowTitle, { flex: 1 }]}>{t}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>
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
  chevron: { fontSize: 16, color: C.muted2 },
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
  menuRowSub: { fontSize: 11, color: C.muted, marginTop: 1 },
});
