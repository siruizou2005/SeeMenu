import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DishArt from '../../src/components/DishArt';
import Ico from '../../src/components/Icons';
import { useApp } from '../../src/context/AppContext';
import { MENU_BY_ID } from '../../src/data';
import C from '../../src/theme';

const DIETARY = ['不要葱', '不要香菜', '少盐', '辣', '面硬'];
const INGREDIENTS: Record<string, string[]> = {
  tonkotsu: ['猪骨白汤', '溏心蛋', '叉烧', '海苔', '葱花', '麦面'],
  shoyu: ['酱油汤底', '鸡骨', '昆布', '叉烧', '细面'],
  gyoza: ['猪肉', '白菜', '姜', '葱', '饺子皮'],
  karaage: ['鸡腿肉', '生姜', '酱油', '淀粉', '柠檬'],
  edamame: ['毛豆', '海盐'],
  tamago: ['鸡蛋', '酱油', '味淋'],
  chashu: ['猪五花', '酱汁', '葱油', '米饭'],
  highball: ['威士忌', '苏打水', '冰块'],
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cart, addItem, removeItem } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const d = MENU_BY_ID[id];
  if (!d) return null;

  const qty = cart[d.id] || 0;
  const ingredients = INGREDIENTS[d.id] || [];
  const toggleDiet = (t: string) => setSelectedDietary(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* hero */}
      <View style={styles.hero}>
        <DishArt dish={d} w={343} h={240} rounded={0} />
        <View style={styles.aiBadge}>
          {Ico.sparkle('#fff', 10)}
          <Text style={styles.aiBadgeText}>AI 示意图</Text>
        </View>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          {Ico.back(C.ink, 16)}
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.tags}>
              {d.tag && <View style={styles.tagAccent}><Text style={styles.tagAccentText}>{d.tag}</Text></View>}
              <View style={styles.tagMuted}><Text style={styles.tagMutedText}>店主推荐</Text></View>
            </View>
            <Text style={styles.cn}>{d.cn}</Text>
            <Text style={styles.jp}>{d.jp} · {d.romaji}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.price}>{d.price}</Text>
            <Text style={styles.cnPrice}>{d.cnPrice}</Text>
          </View>
        </View>

        <Text style={styles.blurb}>{d.blurb}</Text>

        {ingredients.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>主要食材</Text>
            <View style={styles.chips}>
              {ingredients.map(t => <View key={t} style={styles.chip}><Text style={styles.chipText}>{t}</Text></View>)}
            </View>
          </>
        )}

        <Text style={styles.sectionLabel}>忌口与备注</Text>
        <View style={styles.chips}>
          {DIETARY.map(t => {
            const sel = selectedDietary.includes(t);
            return (
              <Pressable key={t} onPress={() => toggleDiet(t)} style={[styles.dietChip, sel && styles.dietChipActive]}>
                <Text style={[styles.dietChipText, sel && styles.dietChipTextActive]}>{sel ? '✓ ' : ''}{t}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.stepper}>
          <Pressable onPress={() => removeItem(d.id)} style={styles.stepBtn}>{Ico.minus(C.ink, 14)}</Pressable>
          <Text style={styles.stepQty}>{qty}</Text>
          <Pressable onPress={() => addItem(d.id)} style={styles.stepBtnDark}>{Ico.plus('#fff', 14)}</Pressable>
        </View>
        <Pressable onPress={() => { if (qty === 0) addItem(d.id); router.push('/cart'); }} style={styles.addToCart}>
          <Text style={styles.addToCartText}>{qty > 0 ? `已加 ${qty} 份 · 去结单` : `加入订单 · ${d.price}`}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  hero: { marginHorizontal: 16, height: 240, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  aiBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, flexDirection: 'row', alignItems: 'center', gap: 4 },
  aiBadgeText: { fontSize: 10, color: '#fff' },
  backBtn: { position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  scroll: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  tags: { flexDirection: 'row', gap: 5, marginBottom: 4 },
  tagAccent: { backgroundColor: C.accentSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  tagAccentText: { fontSize: 9, color: C.accent, fontWeight: '600' },
  tagMuted: { backgroundColor: C.bg2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  tagMutedText: { fontSize: 9, color: C.ink2, fontWeight: '600' },
  cn: { fontSize: 22, fontWeight: '700', color: C.ink, letterSpacing: -0.3 },
  jp: { fontSize: 11, color: C.muted, marginTop: 2 },
  price: { fontSize: 22, fontWeight: '700', color: C.ink },
  cnPrice: { fontSize: 10, color: C.muted },
  blurb: { marginTop: 12, fontSize: 13, lineHeight: 20, color: C.ink2 },
  sectionLabel: { marginTop: 16, marginBottom: 6, fontSize: 11, color: C.muted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: C.bg2, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 11, color: C.ink2 },
  dietChip: { backgroundColor: '#fff', borderWidth: 0.5, borderColor: C.line, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  dietChipActive: { backgroundColor: C.ink, borderWidth: 0 },
  dietChipText: { fontSize: 12, color: C.ink2, fontWeight: '500' },
  dietChipTextActive: { color: '#fff', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: C.line },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stepQty: { fontSize: 15, fontWeight: '700', minWidth: 14, textAlign: 'center' },
  stepBtnDark: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  addToCart: { flex: 1, height: 44, backgroundColor: C.accent, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  addToCartText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
