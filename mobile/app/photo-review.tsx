import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../src/context/AppContext';
import Ico from '../src/components/Icons';
import C from '../src/theme';

const MENU_ITEMS = [
  ['豚骨ラーメン', '¥1,180'], ['醤油ラーメン', '¥1,080'], ['味噌ラーメン', '¥1,180'],
  ['つけ麺', '¥1,280'], ['焼き餃子', '¥580'], ['鶏の唐揚げ', '¥780'],
  ['枝豆', '¥380'], ['チャーシュー丼', '¥880'], ['味付け玉子', '¥180'],
];

export default function PhotoReviewScreen() {
  const { capturedPhoto } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={styles.bg}>
        {capturedPhoto ? (
          <Image source={{ uri: capturedPhoto }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>麺処 つばき</Text>
            <View style={styles.menuDivider} />
            {MENU_ITEMS.map(([n, p], i) => (
              <View key={i} style={styles.menuRow}>
                <Text style={styles.menuItem}>{n}</Text>
                <Text style={styles.menuPrice}>{p}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <Pressable onPress={() => router.back()} style={styles.glassBtn}>
          {Ico.back('#fff', 16)}
        </Pressable>
        <Text style={styles.topTitle}>预览</Text>
        <Pressable onPress={() => router.replace('/capture')} style={styles.glassBtn}>
          <Text style={styles.retakeText}>重拍</Text>
        </Pressable>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>✓ 已拍清晰</Text>
      </View>

      {/* bottom */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.bottomHint}>确认无误后开始 AI 识别（约需 5–10 秒）</Text>
        <View style={styles.bottomBtns}>
          <Pressable onPress={() => router.replace('/capture')} style={styles.retakeBtn}>
            <Text style={styles.retakeBtnText}>重拍</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/recognizing')} style={styles.startBtn}>
            {Ico.sparkle('#fff', 16)}
            <Text style={styles.startBtnText}>开始识别</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0805' },
  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1a1108', alignItems: 'center', justifyContent: 'center' },
  menuCard: { width: 280, backgroundColor: '#f0e4c8', padding: 24, borderRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 25 }, shadowOpacity: 0.6, shadowRadius: 30 },
  menuTitle: { textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#2a1a08', letterSpacing: 3 },
  menuDivider: { height: 1.5, backgroundColor: '#2a1a08', marginVertical: 14, marginHorizontal: 30 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  menuItem: { fontSize: 12, color: '#2a1a08' },
  menuPrice: { fontSize: 12, color: '#2a1a08' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10, zIndex: 5 },
  glassBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#fff', textAlign: 'center' },
  retakeText: { fontSize: 11, color: '#fff' },
  badge: { position: 'absolute', alignSelf: 'center', top: 110, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, zIndex: 5 },
  badgeText: { fontSize: 12, color: C.ink, fontWeight: '500' },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingTop: 0 },
  bottomHint: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 10 },
  bottomBtns: { flexDirection: 'row', gap: 10 },
  retakeBtn: { flex: 1, height: 48, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  retakeBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  startBtn: { flex: 2, height: 48, backgroundColor: C.accent, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
