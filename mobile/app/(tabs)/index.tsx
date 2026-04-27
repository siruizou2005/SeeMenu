import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import C from '../../src/theme';
import Ico from '../../src/components/Icons';
import { useApp } from '../../src/context/AppContext';
import { t } from '../../src/i18n';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { uiLang } = useApp();
  const s = t(uiLang);

  const STEPS = [
    { num: '①', title: s.step1Title, sub: s.step1Sub, icon: (c: string) => Ico.camera(c, 18) },
    { num: '②', title: s.step2Title, sub: s.step2Sub, icon: (c: string) => Ico.sparkle(c, 16) },
    { num: '③', title: s.step3Title, sub: s.step3Sub, icon: (c: string) => Ico.globe(c, 16) },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <View style={styles.logo}><Text style={styles.logoText}>S</Text></View>
          <Text style={styles.brandName}>{s.appName}</Text>
        </View>
        <Text style={styles.hero}>{s.heroTitle}</Text>
        <Text style={styles.sub}>{s.heroSub}</Text>
        <View style={styles.steps}>
          {STEPS.map((it) => (
            <View key={it.num} style={styles.stepCard}>
              <View style={styles.stepIcon}>{it.icon(C.ink)}</View>
              <View style={styles.stepBody}>
                <Text style={styles.stepTitle}>{it.title}</Text>
                <Text style={styles.stepSub}>{it.sub}</Text>
              </View>
              <Text style={styles.stepNum}>{it.num}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.ctaBtn} onPress={() => router.push('/capture')}>
          {Ico.camera('#fff', 20)}
          <Text style={styles.ctaText}>{s.takePhoto}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/join-room')} style={styles.joinLink}>
          <Text style={styles.joinMuted}>{s.joinFriend}</Text>
          <Text style={styles.joinAccent}>{s.enterRoom}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingTop: 40 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 26, height: 26, borderRadius: 7, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  brandName: { fontSize: 15, fontWeight: '600', color: C.ink },
  hero: { marginTop: 48, fontSize: 30, lineHeight: 38, fontWeight: '700', color: C.ink, letterSpacing: -0.6 },
  sub: { marginTop: 10, fontSize: 13, lineHeight: 20, color: C.muted, maxWidth: 280 },
  steps: { marginTop: 38, gap: 10 },
  stepCard: { backgroundColor: C.bg2, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', borderWidth: 0.5, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  stepBody: { flex: 1 },
  stepTitle: { fontSize: 14, fontWeight: '600', color: C.ink },
  stepSub: { fontSize: 11, color: C.muted, marginTop: 1 },
  stepNum: { fontSize: 12, color: C.muted2, fontWeight: '600' },
  footer: { padding: 20, paddingTop: 0 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: C.ink, height: 52, borderRadius: 26 },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  joinLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 12, gap: 2 },
  joinMuted: { fontSize: 12, color: C.muted },
  joinAccent: { fontSize: 12, color: C.accent, fontWeight: '600' },
});
