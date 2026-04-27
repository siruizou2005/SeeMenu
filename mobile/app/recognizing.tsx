import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import CNav from '../src/components/CNav';
import Ico from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';
import { t } from '../src/i18n';
import C from '../src/theme';

const ITEM_HEIGHT = 21;
const RING_R = 13;
const RING_CIRC = 2 * Math.PI * RING_R;

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

type ItemRow = { jp: string; cn: string | null };

export default function RecognizingScreen() {
  const insets = useSafeAreaInsets();
  const { capturedPhoto, setMenuData, addHistory, targetLang, uiLang, setDetectedLang } = useApp();
  const s = t(uiLang);

  const [items, setItems] = useState<ItemRow[]>([]);
  const [doneCount, setDoneCount] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const STEPS = s.scanSteps;

  const beamTop = useSharedValue(40);
  const beamStyle = useAnimatedStyle(() => ({ top: beamTop.value }));

  const progress = doneCount / Math.max(doneCount + 3, 6);
  const dashOffset = RING_CIRC * (1 - progress);

  const navigatedRef = useRef(false);

  useEffect(() => {
    if (!capturedPhoto) {
      router.replace('/recognize-fail');
      return;
    }
    try {
      startScan(capturedPhoto);
    } catch {
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        router.replace('/recognize-fail');
      }
    }
  }, []);

  function startScan(photoUri: string) {
    const formData = new FormData();
    formData.append('photo', {
      uri: photoUri,
      name: 'menu.jpg',
      type: 'image/jpeg',
    } as any);
    formData.append('targetLang', uiLang);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/api/scan/progress`);

    let processed = 0;

    const processText = (text: string) => {
      const lines = text.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        let data: any;
        try { data = JSON.parse(line.slice(6)); } catch { continue; }

        if (data.type === 'detected') {
          setDetectedLang(data.lang);
        } else if (data.type === 'item') {
          const { item, done: n, stepIdx: si } = data;
          setItems(prev => [...prev, { jp: item.jp, cn: item.cn }]);
          setDoneCount(n);
          setStepIdx(si);
          beamTop.value = withTiming(40 + n * ITEM_HEIGHT, { duration: 300 });
        } else if (data.type === 'done') {
          if (navigatedRef.current) return;
          navigatedRef.current = true;
          setMenuData(data.items);
          addHistory(data.items);
          setTimeout(() => router.replace('/menu'), 400);
        } else if (data.type === 'error') {
          if (!navigatedRef.current) {
            navigatedRef.current = true;
            router.replace('/recognize-fail');
          }
        }
      }
    };

    xhr.onprogress = () => {
      const newText = xhr.responseText.slice(processed);
      processed = xhr.responseText.length;
      if (newText) processText(newText);
    };

    xhr.onload = () => {
      const remaining = xhr.responseText.slice(processed);
      if (remaining) processText(remaining);
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        router.replace('/recognize-fail');
      }
    };

    xhr.onerror = () => {
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        router.replace('/recognize-fail');
      }
    };

    xhr.send(formData);
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title={s.scanTitle} sub={s.scanSub} back={false} />

      <View style={[styles.preview, { top: insets.top + 56 }]}>
        <View style={styles.previewInner}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>{s.scanCardTitle}</Text>
            <View style={styles.menuDivider} />
            {items.length === 0 ? (
              <View style={styles.menuRow}>
                <Text style={[styles.menuRowText, { color: '#8a7060', fontStyle: 'italic' }]}>{s.scanWaiting}</Text>
              </View>
            ) : (
              items.map((it, i) => (
                <View key={i} style={styles.menuRow}>
                  <Text style={styles.menuRowText} numberOfLines={1}>{it.jp}</Text>
                  {it.cn && (
                    <View style={styles.cnBadge}><Text style={styles.cnBadgeText}>{it.cn}</Text></View>
                  )}
                </View>
              ))
            )}
            <Animated.View style={[styles.scanBeam, beamStyle]} />
          </View>
        </View>
      </View>

      <View style={[styles.sheet, { bottom: insets.bottom + 24 }]}>
        <View style={styles.sheetTop}>
          <View style={styles.ringWrap}>
            <Svg width={32} height={32} viewBox="0 0 32 32">
              <Circle cx="16" cy="16" r={RING_R} stroke={C.bg3} strokeWidth="3" fill="none" />
              <Circle
                cx="16" cy="16" r={RING_R}
                stroke={C.accent} strokeWidth="3" fill="none"
                strokeDasharray={RING_CIRC}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation="-90" origin="16,16"
              />
            </Svg>
            <Text style={styles.pct}>{Math.round(progress * 100)}%</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sheetTitle}>
              {doneCount === 0 ? s.scanWaiting : s.scanDone(doneCount)}
            </Text>
            <Text style={styles.sheetSub}>
              {doneCount > 0 ? s.scanStep(STEPS[stepIdx]) : ''}
            </Text>
          </View>
          {Ico.sparkle(C.accent, 16)}
        </View>
        <View style={styles.stepsRow}>
          {STEPS.map((s, i) => {
            const state = i < stepIdx ? 'done' : i === stepIdx ? 'active' : 'pending';
            return (
              <View key={s} style={{ flex: 1 }}>
                <View style={[styles.stepBar, state === 'done' && { backgroundColor: C.ink }, state === 'active' && { backgroundColor: C.accent }]} />
                <Text style={[styles.stepLabel, state === 'pending' && { color: C.muted }, state === 'active' && { fontWeight: '700' }]}>{s}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  preview: { position: 'absolute', left: 20, right: 20, bottom: 220 },
  previewInner: { flex: 1, backgroundColor: C.bg2, borderRadius: 16, padding: 16 },
  menuCard: { flex: 1, backgroundColor: '#f0e4c8', borderRadius: 6, padding: 16, position: 'relative', overflow: 'hidden', minHeight: 120 },
  menuTitle: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: '#2a1a08', letterSpacing: 2 },
  menuDivider: { height: 1, backgroundColor: '#2a1a08', marginVertical: 8, marginHorizontal: 24 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  menuRowText: { fontSize: 11, color: '#2a1a08', flex: 1 },
  cnBadge: { backgroundColor: C.accent, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3 },
  cnBadgeText: { fontSize: 9, color: '#fff', fontWeight: '600' },
  scanBeam: {
    position: 'absolute', left: 14, right: 14, height: 1.5,
    backgroundColor: C.accent,
    shadowColor: C.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 4,
  },
  sheet: {
    position: 'absolute', left: 16, right: 16,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: C.line,
    borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.06, shadowRadius: 20,
  },
  sheetTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ringWrap: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  pct: { position: 'absolute', fontSize: 7, fontWeight: '700', color: C.ink },
  sheetTitle: { fontSize: 14, fontWeight: '600', color: C.ink },
  sheetSub: { fontSize: 11, color: C.muted, marginTop: 1 },
  stepsRow: { flexDirection: 'row', gap: 6, marginTop: 12 },
  stepBar: { height: 3, borderRadius: 2, backgroundColor: C.line, marginBottom: 5 },
  stepLabel: { fontSize: 10, color: C.ink, fontWeight: '500' },
});
