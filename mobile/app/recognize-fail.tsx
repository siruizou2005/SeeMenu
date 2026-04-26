import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import CNav from '../src/components/CNav';
import C from '../src/theme';

const TIPS = ['把菜单整体放进取景框', '保持手机平稳，避免抖动', '尽量正面拍摄，不要倾斜', '光线充足、避免反光'];

export default function RecognizeFailScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title="识别中" />
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <Circle cx="20" cy="20" r="18" stroke={C.muted} strokeWidth="2" />
            <Path d="M20 12v10M20 26v2" stroke={C.muted} strokeWidth="2" strokeLinecap="round" />
          </Svg>
        </View>
        <Text style={styles.title}>没能识别这张菜单</Text>
        <Text style={styles.sub}>照片可能模糊、反光或角度倾斜{'\n'}试试重新拍一张，把菜单铺平、光线充足</Text>
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>拍照小提示</Text>
          {TIPS.map((t, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipDot}>·</Text>
              <Text style={styles.tipText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable onPress={() => router.replace('/capture')} style={styles.outlineBtn}>
          <Text style={styles.outlineBtnText}>从相册选</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/capture')} style={styles.solidBtn}>
          <Text style={styles.solidBtnText}>重新拍</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '600', color: C.ink, marginBottom: 6 },
  sub: { fontSize: 13, lineHeight: 20, color: C.muted, textAlign: 'center' },
  tipsCard: { width: '100%', marginTop: 24, backgroundColor: C.bg2, borderRadius: 12, padding: 14 },
  tipsTitle: { fontSize: 11, fontWeight: '600', color: C.ink, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  tipRow: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  tipDot: { color: C.accent, fontWeight: '700' },
  tipText: { fontSize: 12, color: C.ink2 },
  footer: { flexDirection: 'row', gap: 10, padding: 20, borderTopWidth: 0.5, borderTopColor: C.line, backgroundColor: '#fff' },
  outlineBtn: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  outlineBtnText: { fontSize: 14, fontWeight: '600', color: C.ink },
  solidBtn: { flex: 1, height: 48, borderRadius: 24, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  solidBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
