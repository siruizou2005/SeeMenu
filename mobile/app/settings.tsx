import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CNav from '../src/components/CNav';
import Toggle from '../src/components/Toggle';
import C from '../src/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({ label, value, toggle, on, onChange, first }: {
  label: string; value?: string; toggle?: boolean;
  on?: boolean; onChange?: (v: boolean) => void; first?: boolean;
}) {
  return (
    <View style={[styles.row, !first && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <Toggle on={on!} onChange={onChange!} />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          <Text style={styles.rowArrow}>›</Text>
        </View>
      )}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [t, setT] = useState({ showOrig: true, autoAlert: true, calories: false, autoScan: true, haptic: true });
  const toggle = (k: keyof typeof t) => setT(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title="设置" />
      <ScrollView style={styles.scroll}>
        <Section title="语言与翻译">
          <Row first label="原始语言" value="日语 (自动)" />
          <Row label="翻译为" value="简体中文" />
          <Row label="同时显示原文" toggle on={t.showOrig} onChange={() => toggle('showOrig')} />
        </Section>
        <Section title="忌口与偏好">
          <Row first label="忌口设置" value="海鲜 · 辣" />
          <Row label="自动标红风险菜品" toggle on={t.autoAlert} onChange={() => toggle('autoAlert')} />
          <Row label="显示卡路里估算" toggle on={t.calories} onChange={() => toggle('calories')} />
        </Section>
        <Section title="通用">
          <Row first label="按金额排序时显示" value="日元 · 人民币" />
          <Row label="拍照后自动识别" toggle on={t.autoScan} onChange={() => toggle('autoScan')} />
          <Row label="震动反馈" toggle on={t.haptic} onChange={() => toggle('haptic')} />
        </Section>
        <Section title="关于">
          <Row first label="版本" value="1.2.0" />
          <Row label="服务协议" />
          <Row label="隐私政策" />
        </Section>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg2 },
  scroll: { flex: 1, marginTop: 44 },
  section: { marginTop: 8 },
  sectionLabel: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6, fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: '600' },
  sectionCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, minHeight: 44, paddingVertical: 12 },
  rowBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  rowLabel: { flex: 1, fontSize: 14, color: C.ink },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowValue: { fontSize: 13, color: C.muted },
  rowArrow: { fontSize: 16, color: C.muted2 },
});
