import { useState } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../../src/context/AppContext';
import { SAMPLE_MENU, type Dish } from '../../src/data';
import DishArt from '../../src/components/DishArt';
import Ico from '../../src/components/Icons';
import C from '../../src/theme';

const CATS = ['全部', '招牌', 'ラーメン', 'おつまみ', 'ご飯', 'ドリンク'];
const CAT_KEYS: Record<string, (d: Dish) => boolean> = {
  '招牌': d => d.tag === '招牌' || d.tag === '热门',
  'ラーメン': d => d.cat.includes('ラーメン'),
  'おつまみ': d => d.cat.includes('おつまみ'),
  'ご飯': d => d.cat.includes('ご飯'),
  'ドリンク': d => d.cat.includes('ドリンク'),
};

export default function MenuScreen() {
  const { cart, addItem, removeItem, cartCount, cartTotal } = useApp();
  const insets = useSafeAreaInsets();
  const [activeCat, setActiveCat] = useState('全部');
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_MENU.filter(d => {
    const matchCat = activeCat === '全部' || (CAT_KEYS[activeCat]?.(d));
    const matchSearch = !search || d.cn.includes(search) || d.jp.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.headerMeta}>
          <Text style={styles.metaText}>东京</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>日文菜单</Text>
          <View style={styles.usersChip}>
            {Ico.users(C.accent, 12)}
            <Text style={styles.usersText}>3 人</Text>
          </View>
        </View>
        <Text style={styles.restaurantName}>麺処 つばき</Text>
      </View>

      {/* search */}
      <View style={styles.searchBar}>
        {Ico.search(C.muted, 14)}
        <TextInput value={search} onChangeText={setSearch} placeholder="搜索菜品" style={styles.searchInput} placeholderTextColor={C.muted} />
      </View>

      {/* categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScrollView} contentContainerStyle={styles.catStrip}>
        {CATS.map(c => (
          <Pressable key={c} onPress={() => setActiveCat(c)} style={[styles.catPill, activeCat === c && styles.catPillActive]}>
            <Text style={[styles.catText, activeCat === c && styles.catTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* list */}
      <FlatList
        data={filtered}
        keyExtractor={d => d.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: cartCount > 0 ? 90 : 20 }}
        renderItem={({ item: d, index }) => (
          <Pressable style={({ pressed }) => [styles.dishRow, index > 0 && styles.dishBorder, pressed && { opacity: 0.85 }]} onPress={() => router.push(`/menu/${d.id}`)}>
            <DishArt dish={d} w={72} h={72} rounded={12} />
            <View style={styles.dishInfo}>
              <View style={styles.dishNameRow}>
                <Text style={styles.dishName}>{d.cn}</Text>
                {d.tag && <View style={styles.tag}><Text style={styles.tagText}>{d.tag}</Text></View>}
              </View>
              <Text style={styles.dishJp} numberOfLines={1}>{d.jp}</Text>
              <Text style={styles.dishBlurb} numberOfLines={2}>{d.blurb}</Text>
              <View style={styles.dishFooter}>
                <View>
                  <Text style={styles.dishPrice}>{d.price}</Text>
                  <Text style={styles.dishCnPrice}>{d.cnPrice}</Text>
                </View>
                <Pressable onPress={e => { e.stopPropagation(); }} hitSlop={4}>
                  {(cart[d.id] || 0) > 0 ? (
                    <View style={styles.stepper}>
                      <Pressable onPress={e => { e.stopPropagation(); removeItem(d.id); }} style={styles.stepperMinus}>{Ico.minus(C.ink, 12)}</Pressable>
                      <Text style={styles.stepperQty}>{cart[d.id]}</Text>
                      <Pressable onPress={e => { e.stopPropagation(); addItem(d.id); }} style={styles.stepperPlus}>{Ico.plus('#fff', 12)}</Pressable>
                    </View>
                  ) : (
                    <Pressable onPress={e => { e.stopPropagation(); addItem(d.id); }} style={styles.addBtn}>{Ico.plus('#fff', 14)}</Pressable>
                  )}
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />

      {/* cart bar */}
      {cartCount > 0 && (
        <Pressable onPress={() => router.push('/cart')} style={[styles.cartBar, { bottom: insets.bottom + 8 }]}>
          <View style={styles.cartIconWrap}>
            {Ico.cart('#fff', 20)}
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cartTotal}>¥{cartTotal.toLocaleString()}</Text>
            <Text style={styles.cartCn}>约 ¥{Math.round(cartTotal / 20)}</Text>
          </View>
          <View style={styles.cartAction}><Text style={styles.cartActionText}>选好</Text></View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { paddingHorizontal: 20, paddingVertical: 14 },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 11, color: C.muted },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: C.muted2 },
  usersChip: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  usersText: { fontSize: 11, color: C.accent, fontWeight: '600' },
  restaurantName: { fontSize: 22, fontWeight: '700', color: C.ink, marginTop: 4, letterSpacing: -0.3 },
  searchBar: { marginHorizontal: 16, height: 34, backgroundColor: C.bg2, borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 13, color: C.ink },
  catScrollView: { flexGrow: 0 },
  catStrip: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' },
  catPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: C.bg2 },
  catPillActive: { backgroundColor: C.ink },
  catText: { fontSize: 12, fontWeight: '600', color: C.ink2 },
  catTextActive: { color: '#fff' },
  dishRow: { flexDirection: 'row', gap: 12, paddingVertical: 14, backgroundColor: '#fff' },
  dishBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  dishInfo: { flex: 1 },
  dishNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dishName: { fontSize: 14, fontWeight: '600', color: C.ink },
  tag: { backgroundColor: C.accentSoft, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3 },
  tagText: { fontSize: 9, color: C.accent, fontWeight: '600' },
  dishJp: { fontSize: 10, color: C.muted, marginTop: 1 },
  dishBlurb: { fontSize: 10, lineHeight: 14, color: C.muted, marginTop: 4 },
  dishFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 6 },
  dishPrice: { fontSize: 14, fontWeight: '700', color: C.ink },
  dishCnPrice: { fontSize: 10, color: C.muted },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperMinus: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stepperQty: { fontSize: 13, fontWeight: '600', minWidth: 12, textAlign: 'center' },
  stepperPlus: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  cartBar: {
    position: 'absolute', left: 12, right: 12,
    backgroundColor: C.ink, borderRadius: 26,
    padding: 8, paddingLeft: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16,
  },
  cartIconWrap: { position: 'relative' },
  cartBadge: { position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.ink },
  cartBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  cartTotal: { fontSize: 14, fontWeight: '700', color: '#fff' },
  cartCn: { fontSize: 10, color: 'rgba(255,255,255,0.55)' },
  cartAction: { backgroundColor: C.accent, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  cartActionText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
