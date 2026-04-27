import { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CNav from '../src/components/CNav';
import DishArt from '../src/components/DishArt';
import Ico from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';
import { t } from '../src/i18n';
import { dishName } from '../src/data';
import C from '../src/theme';

export default function CartScreen() {
  const { cartLines, addItem, removeItem, setNote, cartCount, cartTotal, cartCnTotal, currencySymbol, uiLang } = useApp();
  const s = t(uiLang);
  const insets = useSafeAreaInsets();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  if (cartLines.length === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <CNav title={s.myOrder} />
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyText}>{s.emptyCart}</Text>
          <Pressable onPress={() => router.push('/menu')} style={styles.emptyBtn}>
            <Text style={styles.emptyBtnText}>{s.browseMenu}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={[styles.root, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <CNav title={s.myOrder} sub={s.totalLabel(cartCount)} />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8 }}>
        {cartLines.map((l, i) => (
          <View key={l.id} style={[styles.row, i > 0 && styles.rowBorder]}>
            <DishArt dish={l.dish} w={56} h={56} rounded={10} />
            <View style={{ flex: 1 }}>
              <View style={styles.rowTop}>
                <View>
                  <Text style={styles.dishName}>{dishName(l.dish, uiLang)}</Text>
                  <Text style={styles.dishJp}>{l.dish.jp}</Text>
                </View>
                <Text style={styles.dishPrice}>{l.dish.price}</Text>
              </View>

              {editingNote === l.id ? (
                <View style={styles.noteEdit}>
                  <TextInput autoFocus value={noteInput} onChangeText={setNoteInput} placeholder={s.notePlaceholder} style={styles.noteInput} placeholderTextColor={C.muted} />
                  <Pressable onPress={() => { setNote(l.id, noteInput); setEditingNote(null); }} style={styles.noteConfirm}>
                    <Text style={styles.noteConfirmText}>{s.noteConfirm}</Text>
                  </Pressable>
                </View>
              ) : l.note ? (
                <Pressable onPress={() => { setEditingNote(l.id); setNoteInput(l.note); }} style={styles.noteChip}>
                  <Text style={styles.noteChipText}>📝 {l.note}</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => { setEditingNote(l.id); setNoteInput(''); }}>
                  <Text style={styles.addNote}>{s.addNote}</Text>
                </Pressable>
              )}

              <View style={styles.stepper}>
                <Pressable onPress={() => removeItem(l.id)} style={styles.stepMinus}>{Ico.minus(C.ink, 12)}</Pressable>
                <Text style={styles.stepQty}>{l.qty}</Text>
                <Pressable onPress={() => addItem(l.id)} style={styles.stepPlus}>{Ico.plus('#fff', 12)}</Pressable>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 130 }} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.footerLabel}>{s.totalLabel(cartCount)}</Text>
          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalNum}>{currencySymbol}{cartTotal.toLocaleString()}</Text>
            <Text style={styles.footerCn}> {s.approxRef} ¥{Math.round(cartCnTotal)}</Text>
          </View>
        </View>
        <Pressable onPress={() => router.push('/order')} style={styles.confirmBtn}>
          <Text style={styles.confirmBtnText}>{s.showWaiter}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: C.muted },
  emptyBtn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, backgroundColor: C.ink },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  roomChip: { paddingHorizontal: 8 },
  roomChipText: { fontSize: 11, color: C.accent, fontWeight: '600' },
  scroll: { flex: 1, marginTop: 44 },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 14 },
  rowBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between' },
  dishName: { fontSize: 14, fontWeight: '600', color: C.ink },
  dishJp: { fontSize: 10, color: C.muted, marginTop: 1 },
  dishPrice: { fontSize: 13, fontWeight: '700', color: C.ink },
  noteEdit: { flexDirection: 'row', gap: 6, marginTop: 6 },
  noteInput: { flex: 1, fontSize: 11, padding: 4, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1, borderColor: C.line },
  noteConfirm: { backgroundColor: C.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  noteConfirmText: { fontSize: 11, color: '#fff' },
  noteChip: { marginTop: 6, backgroundColor: C.accentSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, alignSelf: 'flex-start' },
  noteChipText: { fontSize: 11, color: C.accent },
  addNote: { marginTop: 6, fontSize: 11, color: C.muted, textDecorationLine: 'underline' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  stepMinus: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stepQty: { fontSize: 13, fontWeight: '600', minWidth: 12, textAlign: 'center' },
  stepPlus: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: 16, borderTopWidth: 0.5, borderTopColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff' },
  footerLabel: { fontSize: 10, color: C.muted },
  footerTotal: { flexDirection: 'row', alignItems: 'baseline' },
  footerTotalNum: { fontSize: 20, fontWeight: '700', color: C.ink },
  footerCn: { fontSize: 11, color: C.muted },
  confirmBtn: { marginLeft: 'auto', backgroundColor: C.ink, paddingHorizontal: 22, paddingVertical: 14, borderRadius: 26 },
  confirmBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
