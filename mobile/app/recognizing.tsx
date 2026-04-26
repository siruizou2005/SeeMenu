import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import CNav from '../src/components/CNav';
import Ico from '../src/components/Icons';
import C from '../src/theme';

const ALL_ITEMS = [
  { jp: '豚骨ラーメン', cn: '豚骨拉面', state: 'pending' },
  { jp: '醤油ラーメン', cn: '酱油拉面', state: 'pending' },
  { jp: '焼き餃子',     cn: '煎饺',     state: 'pending' },
  { jp: '鶏の唐揚げ',   cn: '日式炸鸡', state: 'pending' },
  { jp: '枝豆',         cn: null,        state: 'pending' },
  { jp: 'チャーシュー丼', cn: null,      state: 'pending' },
  { jp: '味付け玉子',   cn: null,        state: 'pending' },
];

const STEPS = ['识别', '翻译', '配图', '整理'];
const ITEM_HEIGHT = 21;
const RING_R = 13;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function RecognizingScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(ALL_ITEMS);
  const [doneCount, setDoneCount] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  const beamTop = useSharedValue(40);
  const beamStyle = useAnimatedStyle(() => ({ top: beamTop.value }));

  useEffect(() => {
    let idx = 0;
    const tid = setInterval(() => {
      if (idx >= ALL_ITEMS.length) {
        clearInterval(tid);
        setTimeout(() => router.replace('/menu'), 600);
        return;
      }
      setItems(prev => {
        const next = [...prev];
        if (idx > 0) next[idx - 1] = { ...next[idx - 1], state: 'done' };
        if (idx < next.length) next[idx] = { ...next[idx], state: 'active' };
        return next;
      });
      setDoneCount(idx);
      setStepIdx(Math.min(Math.floor(idx / 2), STEPS.length - 1));
      beamTop.value = withTiming(40 + idx * ITEM_HEIGHT, { duration: 500 });
      idx++;
    }, 500);
    return () => clearInterval(tid);
  }, []);

  const progress = doneCount / ALL_ITEMS.length;
  const dashOffset = RING_CIRC * (1 - progress);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title="识别中" sub="保持手机稳定" back={false} />

      <View style={[styles.preview, { top: insets.top + 56 }]}>
        <View style={styles.previewInner}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>麺処 つばき</Text>
            <View style={styles.menuDivider} />
            {items.map((it, i) => (
              <View key={i} style={[styles.menuRow, { opacity: it.state === 'pending' ? 0.4 : 1 }]}>
                <Text style={styles.menuRowText}>{it.jp}</Text>
                {it.cn && it.state === 'done' && (
                  <View style={styles.cnBadge}><Text style={styles.cnBadgeText}>{it.cn}</Text></View>
                )}
                {it.state === 'active' && (
                  <View style={styles.processingBadge}><Text style={styles.processingText}>翻译中…</Text></View>
                )}
              </View>
            ))}
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
            <Text style={styles.sheetTitle}>识别 {doneCount} / {ALL_ITEMS.length} 道菜</Text>
            <Text style={styles.sheetSub}>预计还需 {ALL_ITEMS.length - doneCount} 秒</Text>
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
  menuCard: { flex: 1, backgroundColor: '#f0e4c8', borderRadius: 6, padding: 16, position: 'relative', overflow: 'hidden' },
  menuTitle: { textAlign: 'center', fontSize: 14, fontWeight: '700', color: '#2a1a08', letterSpacing: 2 },
  menuDivider: { height: 1, backgroundColor: '#2a1a08', marginVertical: 8, marginHorizontal: 24 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  menuRowText: { fontSize: 11, color: '#2a1a08', flex: 1 },
  cnBadge: { backgroundColor: C.accent, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3 },
  cnBadgeText: { fontSize: 9, color: '#fff', fontWeight: '600' },
  processingBadge: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: C.muted2, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 3 },
  processingText: { fontSize: 9, color: C.muted },
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
