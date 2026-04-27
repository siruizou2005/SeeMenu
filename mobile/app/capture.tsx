import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../src/context/AppContext';
import { t } from '../src/i18n';
import Ico from '../src/components/Icons';
import C from '../src/theme';

const MENU_ITEMS = [
  ['豚骨ラーメン', '¥1,180'], ['醤油ラーメン', '¥1,080'], ['味噌ラーメン', '¥1,180'],
  ['つけ麺', '¥1,280'], ['焼き餃子', '¥580'], ['鶏の唐揚げ', '¥780'],
  ['枝豆', '¥380'], ['チャーシュー丼', '¥880'], ['味付け玉子', '¥180'],
];

export default function CaptureScreen() {
  const { setCapturedPhoto, uiLang } = useApp();
  const s = t(uiLang);
  const insets = useSafeAreaInsets();

  const handleAlbum = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.9 });
    if (!result.canceled) {
      setCapturedPhoto(result.assets[0].uri);
      router.push('/photo-review');
    }
  };

  const handleShutter = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        router.push('/photo-review');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.9 });
      if (!result.canceled) {
        setCapturedPhoto(result.assets[0].uri);
      }
    } catch {
      // Simulator has no camera — fall through to preview with mock data
    }
    router.push('/photo-review');
  };

  return (
    <View style={styles.root}>
      {/* simulated menu bg */}
      <View style={styles.menuBg}>
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
      </View>

      {/* viewfinder */}
      <View style={[styles.vfFrame, { top: insets.top + 46, bottom: 200 }]} pointerEvents="none" />
      <View style={[styles.vfCorner, styles.tl, { top: insets.top + 46, left: 22 }]} />
      <View style={[styles.vfCorner, styles.tr, { top: insets.top + 46, right: 22 }]} />
      <View style={[styles.vfCorner, styles.bl, { bottom: 200, left: 22 }]} />
      <View style={[styles.vfCorner, styles.br, { bottom: 200, right: 22 }]} />

      <View style={[styles.hint, { top: insets.top + 62 }]}>
        <Text style={styles.hintText}>{s.captureMenuFrame}</Text>
      </View>

      {/* bottom controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.modeLine}>
          <Text style={styles.modeInactive}>{s.captureAlbum}</Text>
          <Text style={styles.modeActive}>· {s.captureMenuLabel} ·</Text>
          <Text style={styles.modeInactive}>{s.captureQR}</Text>
        </View>
        <View style={styles.buttons}>
          <Pressable onPress={handleAlbum} style={styles.sideBtn}>
            {Ico.album('#fff', 18)}
          </Pressable>
          <Pressable onPress={handleShutter} style={styles.shutter}>
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.sideBtn}>
            {Ico.flash('#fff', 16)}
          </View>
        </View>
      </View>
    </View>
  );
}

const VF_CORNER = 24;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  menuBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1108',
    alignItems: 'center', justifyContent: 'center',
  },
  menuCard: {
    width: 290, backgroundColor: '#f0e4c8',
    padding: 24, borderRadius: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.6, shadowRadius: 25,
    transform: [{ rotate: '-2deg' }],
  },
  menuTitle: { textAlign: 'center', fontSize: 24, fontWeight: '700', color: '#2a1a08', letterSpacing: 3 },
  menuDivider: { height: 1.5, backgroundColor: '#2a1a08', marginVertical: 14, marginHorizontal: 30 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  menuItem: { fontSize: 13, color: '#2a1a08' },
  menuPrice: { fontSize: 13, color: '#2a1a08' },
  vfFrame: {
    position: 'absolute', left: 22, right: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.55, shadowRadius: 0,
  },
  vfCorner: { position: 'absolute', width: VF_CORNER, height: VF_CORNER },
  tl: { borderTopWidth: 2.5, borderLeftWidth: 2.5, borderColor: '#fff', borderTopLeftRadius: 4 },
  tr: { borderTopWidth: 2.5, borderRightWidth: 2.5, borderColor: '#fff', borderTopRightRadius: 4 },
  bl: { borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderColor: '#fff', borderBottomLeftRadius: 4 },
  br: { borderBottomWidth: 2.5, borderRightWidth: 2.5, borderColor: '#fff', borderBottomRightRadius: 4 },
  hint: {
    position: 'absolute', alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
  },
  hintText: { fontSize: 11, color: C.ink, fontWeight: '500' },
  controls: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center', paddingTop: 12,
  },
  modeLine: { flexDirection: 'row', gap: 22, marginBottom: 18 },
  modeInactive: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  modeActive: { fontSize: 11, color: '#fff', fontWeight: '600' },
  buttons: { flexDirection: 'row', alignItems: 'center', gap: 50 },
  sideBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  shutter: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#fff', padding: 4, backgroundColor: 'transparent' },
  shutterInner: { flex: 1, borderRadius: 50, backgroundColor: '#fff' },
});
