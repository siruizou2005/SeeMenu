import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CNav from '../src/components/CNav';
import Ico from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';
import { MENU_BY_ID, FINAL_ORDER } from '../src/data';
import C from '../src/theme';

export default function OrderScreen() {
  const { cartLines, cartTotal } = useApp();
  const insets = useSafeAreaInsets();

  const lines = cartLines.length > 0
    ? cartLines.map(l => ({ id: l.id, qty: l.qty, note: l.note, by: ['我'] }))
    : FINAL_ORDER;

  const subtotal = lines.reduce((sum, l) => {
    const d = MENU_BY_ID[l.id];
    return d ? sum + parseInt(d.price.replace(/[^\d]/g, '')) * l.qty : sum;
  }, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title="出示给服务员" right={
        <View style={styles.langChip}>
          {Ico.globe(C.accent, 12)}
          <Text style={styles.langText}>中↔日</Text>
        </View>
      } />

      <View style={[styles.receipt, { top: insets.top + 60 }]}>
        {/* receipt header */}
        <View style={styles.receiptHeader}>
          <Text style={styles.orderJp}>ご注文</Text>
          <Text style={styles.orderSub}>ORDER · 订单</Text>
          <View style={styles.orderMeta}>
            <Text style={styles.orderMetaText}>2026.04.26 12:34</Text>
            <Text style={styles.orderMetaText}>3名様 · {lines.reduce((s, l) => s + l.qty, 0)}品</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 4, paddingHorizontal: 20 }}>
          {lines.map((line, i) => {
            const d = MENU_BY_ID[line.id];
            if (!d) return null;
            const lt = parseInt(d.price.replace(/[^\d]/g, '')) * line.qty;
            return (
              <View key={i} style={[styles.lineRow, i < lines.length - 1 && styles.lineRowBorder]}>
                <View style={{ flex: 1 }}>
                  <View style={styles.lineTop}>
                    <Text style={styles.lineJp}>{d.jp}</Text>
                    <Text style={styles.lineQty}>×{line.qty}</Text>
                  </View>
                  <Text style={styles.lineCn}>{d.cn}</Text>
                  {line.note ? (
                    <View style={styles.noteTag}><Text style={styles.noteTagText}>※ {line.note}</Text></View>
                  ) : null}
                </View>
                <Text style={styles.linePrice}>¥{lt.toLocaleString()}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>小計 SUBTOTAL</Text>
            <Text style={styles.totalValue}>¥{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { fontSize: 10 }]}>消費税 10%</Text>
            <Text style={[styles.totalValue, { fontSize: 10 }]}>¥{tax.toLocaleString()}</Text>
          </View>
          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>合計</Text>
            <Text style={styles.grandNum}>¥{total.toLocaleString()}</Text>
          </View>
          <Text style={styles.grandCn}>约 ¥{Math.round(total / 20)}</Text>
        </View>
      </View>

      <View style={[styles.footer, { bottom: insets.bottom + 8 }]}>
        <Pressable onPress={() => router.push('/order-show')} style={styles.showBtn}>
          <Text style={styles.showBtnText}>放大出示给店员</Text>
        </Pressable>
        <Text style={styles.footerHint}>把屏幕递给店员，全程不用开口</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg2 },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  langText: { fontSize: 11, color: C.accent, fontWeight: '600' },
  receipt: { position: 'absolute', left: 16, right: 16, bottom: 80, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.06, shadowRadius: 20 },
  receiptHeader: { padding: 20, paddingBottom: 14, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: C.line, borderStyle: 'dashed' },
  orderJp: { fontSize: 20, fontWeight: '700', color: C.ink, letterSpacing: 4 },
  orderSub: { fontSize: 10, color: C.muted, marginTop: 4, letterSpacing: 1 },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  orderMetaText: { fontSize: 10, color: C.muted },
  lineRow: { paddingVertical: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  lineRowBorder: { borderBottomWidth: 1, borderBottomColor: C.line, borderStyle: 'dotted' },
  lineTop: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  lineJp: { fontSize: 14, fontWeight: '600', color: C.ink, flex: 1 },
  lineQty: { fontSize: 12, color: C.accent, fontWeight: '700' },
  lineCn: { fontSize: 10, color: C.muted, marginTop: 1 },
  noteTag: { marginTop: 4, backgroundColor: C.accentSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3, alignSelf: 'flex-start' },
  noteTagText: { fontSize: 10, color: C.accent },
  linePrice: { fontSize: 12, fontWeight: '700', color: C.ink },
  totals: { borderTopWidth: 1.5, borderTopColor: C.ink, padding: 20, paddingTop: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabel: { fontSize: 11, color: C.muted },
  totalValue: { fontSize: 11, color: C.muted },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 8, borderTopWidth: 0.5, borderTopColor: C.line, marginTop: 4 },
  grandLabel: { fontSize: 15, fontWeight: '700', color: C.ink, letterSpacing: 2 },
  grandNum: { fontSize: 24, fontWeight: '700', color: C.ink },
  grandCn: { textAlign: 'right', fontSize: 10, color: C.muted, marginTop: 2 },
  footer: { position: 'absolute', left: 16, right: 16 },
  showBtn: { height: 44, backgroundColor: C.ink, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  showBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  footerHint: { textAlign: 'center', fontSize: 10, color: C.muted, marginTop: 4, letterSpacing: 1 },
});
