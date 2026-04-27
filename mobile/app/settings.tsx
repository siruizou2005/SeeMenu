import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CNav from '../src/components/CNav';
import Toggle from '../src/components/Toggle';
import C from '../src/theme';
import { useApp } from '../src/context/AppContext';
import { t, UI_LANG_OPTIONS, TARGET_LANG_OPTIONS, TARGET_LANG_LABELS, type UILang, type TargetLang } from '../src/i18n';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Row({ label, value, toggle, on, onChange, first, onPress }: {
  label: string; value?: string; toggle?: boolean;
  on?: boolean; onChange?: (v: boolean) => void;
  first?: boolean; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, !first && styles.rowBorder, pressed && onPress && { opacity: 0.7 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <Toggle on={on!} onChange={onChange!} />
      ) : (
        <View style={styles.rowRight}>
          {value ? <Text style={styles.rowValue}>{value}</Text> : null}
          {onPress && <Text style={styles.rowArrow}>›</Text>}
        </View>
      )}
    </Pressable>
  );
}

function LangPicker<T extends string>({
  visible, options, selected, onSelect, onClose, title,
}: {
  visible: boolean;
  options: { code: T; label: string }[];
  selected: T;
  onSelect: (v: T) => void;
  onClose: () => void;
  title: string;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>{title}</Text>
        {options.map(o => (
          <Pressable key={o.code} onPress={() => { onSelect(o.code); onClose(); }}
            style={({ pressed }) => [styles.option, pressed && { opacity: 0.7 }]}>
            <Text style={[styles.optionText, o.code === selected && styles.optionSelected]}>{o.label}</Text>
            {o.code === selected && <Text style={styles.check}>✓</Text>}
          </Pressable>
        ))}
        <View style={{ height: 24 }} />
      </View>
    </Modal>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { uiLang, setUiLang, targetLang, setTargetLang } = useApp();
  const s = t(uiLang);

  const [showOrig, setShowOrig] = useState(true);
  const [haptic, setHaptic] = useState(true);
  const [uiPicker, setUiPicker] = useState(false);
  const [targetPicker, setTargetPicker] = useState(false);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title={s.settingsTitle} />
      <ScrollView style={styles.scroll}>

        <Section title={s.sectionLang}>
          <Row first label={s.uiLanguage}
            value={UI_LANG_OPTIONS.find(o => o.code === uiLang)?.label}
            onPress={() => setUiPicker(true)} />
          <Row label={s.translateTo}
            value={TARGET_LANG_LABELS[targetLang]}
            onPress={() => setTargetPicker(true)} />
          <Row label={s.showOriginal} toggle on={showOrig} onChange={setShowOrig} />
        </Section>

        <Section title={s.sectionGeneral}>
          <Row first label={s.haptic} toggle on={haptic} onChange={setHaptic} />
        </Section>

        <Section title={s.sectionAbout}>
          <Row first label={s.version} value="1.0.0" />
          <Row label={s.terms} onPress={() => {}} />
          <Row label={s.privacy} onPress={() => {}} />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>

      <LangPicker
        visible={uiPicker}
        options={UI_LANG_OPTIONS}
        selected={uiLang}
        onSelect={v => setUiLang(v as UILang)}
        onClose={() => setUiPicker(false)}
        title={s.uiLanguage}
      />
      <LangPicker
        visible={targetPicker}
        options={TARGET_LANG_OPTIONS}
        selected={targetLang}
        onSelect={v => setTargetLang(v as TargetLang)}
        onClose={() => setTargetPicker(false)}
        title={s.translateTo}
      />
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingTop: 16 },
  sheetTitle: { fontSize: 13, fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: C.line },
  optionText: { flex: 1, fontSize: 16, color: C.ink },
  optionSelected: { fontWeight: '700', color: C.accent },
  check: { fontSize: 16, color: C.accent },
});
