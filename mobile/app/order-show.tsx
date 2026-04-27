import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ico from '../src/components/Icons';
import { useApp } from '../src/context/AppContext';
import { t } from '../src/i18n';
import { dishName } from '../src/data';

export default function OrderShowScreen() {
  const { cartLines, menuData, currencySymbol, cartCnTotal, uiLang } = useApp();
  const s = t(uiLang);
  const insets = useSafeAreaInsets();
  const menuById = Object.fromEntries(menuData.map(d => [d.id, d]));

  const items: [string, string, string, string][] = cartLines
    .map(l => {
      const d = menuById[l.id];
      if (!d) return null;
      const price = parseFloat(d.price.replace(/[^\d.]/g, '') || '0') * l.qty;
      return [d.jp, dishName(d, uiLang), `× ${l.qty}`, `${currencySymbol}${price.toLocaleString()}`] as [string, string, string, string];
    })
    .filter(Boolean) as [string, string, string, string][];

  const total = items.reduce((s, it) => s + parseFloat((it[3] || '0').replace(/[^\d.]/g, '') || '0'), 0);

  return (
    <View style={styles.root}>
      {/* top chrome */}
      <View style={[styles.chrome, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.glassBtn}>
          {Ico.close('#fff', 14)}
        </Pressable>
        <Text style={styles.chromeHint}>{s.showToStaff}</Text>
        <View style={styles.glassBtn}><Text style={styles.rotateText}>↻</Text></View>
      </View>

      {/* receipt */}
      <View style={[styles.receipt, { top: insets.top + 56, bottom: insets.bottom + 16 }]}>
        <View style={styles.receiptHeader}>
          <Text style={styles.headerSub}>{s.receiptOrder}</Text>
          <Text style={styles.headerTitle}>{s.receiptTitle}</Text>
          <Text style={styles.headerMeta}>2026-04-26 · 12:42 · {s.peopleCount(4)}</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 12 }}>
          {items.map(([jp, cn, qty, price], i) => (
            <View key={i}>
              <View style={styles.itemRow}>
                <Text style={styles.itemJp}>{jp}</Text>
                <Text style={styles.itemQty}>{qty}</Text>
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemCn}>{cn}</Text>
                <Text style={styles.itemPrice}>{price}</Text>
              </View>
              {i < items.length - 1 && <View style={styles.itemDivider} />}
            </View>
          ))}
        </ScrollView>

        <View style={styles.receiptFooter}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{s.totalWithTax}</Text>
            <Text style={styles.totalNum}>{currencySymbol}{total.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.notes}>
          <Text style={styles.notesSub}>{s.notesLabel}</Text>
          <Text style={styles.notesText}>海鮮アレルギーがあります。一品はお取り分けでお願いします。</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  chrome: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, zIndex: 5 },
  glassBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  chromeHint: { fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  rotateText: { fontSize: 14, color: '#fff' },
  receipt: { position: 'absolute', left: 16, right: 16, backgroundColor: '#FAF7F0', borderRadius: 4, overflow: 'hidden' },
  receiptHeader: { alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#2a1a08', paddingVertical: 12 },
  headerSub: { fontSize: 11, letterSpacing: 4, color: '#7a5a3a' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#2a1a08', marginTop: 2, letterSpacing: 2 },
  headerMeta: { fontSize: 10, color: '#7a5a3a', marginTop: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  itemJp: { fontSize: 15, fontWeight: '700', color: '#1a1208', letterSpacing: 1, flex: 1 },
  itemQty: { fontSize: 12, color: '#1a1208', fontWeight: '700' },
  itemCn: { fontSize: 11, color: '#7a5a3a', flex: 1 },
  itemPrice: { fontSize: 11, color: '#7a5a3a' },
  itemDivider: { marginVertical: 10, borderTopWidth: 1, borderTopColor: '#c7a878', borderStyle: 'dashed' },
  receiptFooter: { borderTopWidth: 1.5, borderTopColor: '#2a1a08', paddingHorizontal: 18, paddingVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 13, color: '#1a1208' },
  totalLabelSub: { fontSize: 10, color: '#7a5a3a' },
  totalNum: { fontSize: 22, fontWeight: '700', color: '#1a1208' },
  notes: { marginHorizontal: 18, marginBottom: 18, padding: 10, backgroundColor: '#2a1a08', borderRadius: 2 },
  notesSub: { fontSize: 9, letterSpacing: 2, color: 'rgba(250,247,240,0.7)', marginBottom: 3, textTransform: 'uppercase' },
  notesText: { fontSize: 11, lineHeight: 17, color: '#FAF7F0' },
});
