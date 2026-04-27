import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../src/context/AppContext';
import { t } from '../src/i18n';
import Ico from '../src/components/Icons';
import C from '../src/theme';

export default function PhotoReviewScreen() {
  const { capturedPhoto, uiLang } = useApp();
  const s = t(uiLang);
  const insets = useSafeAreaInsets();

  if (!capturedPhoto) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#fff', marginBottom: 20, fontSize: 14 }}>{s.photoNotFound}</Text>
        <Pressable onPress={() => router.replace('/capture')} style={{ backgroundColor: C.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>{s.retake}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.bg}>
        <Image source={{ uri: capturedPhoto }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      </View>

      <View style={[styles.topBar, { paddingTop: insets.top + 14 }]}>
        <Pressable onPress={() => router.back()} style={styles.glassBtn}>
          {Ico.back('#fff', 16)}
        </Pressable>
        <Text style={styles.topTitle}>{s.previewTitle}</Text>
        <Pressable onPress={() => router.replace('/capture')} style={styles.glassBtn}>
          <Text style={styles.retakeText}>{s.retake}</Text>
        </Pressable>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{s.photoGood}</Text>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.bottomHint}>{s.scanHint}</Text>
        <View style={styles.bottomBtns}>
          <Pressable onPress={() => router.replace('/capture')} style={styles.retakeBtn}>
            <Text style={styles.retakeBtnText}>{s.retake}</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/recognizing')} style={styles.startBtn}>
            {Ico.sparkle('#fff', 16)}
            <Text style={styles.startBtnText}>{s.startScan}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0805' },
  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: '#1a1108' },
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
