import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import C from '../../src/theme';
import { HISTORY } from '../../src/data';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>历史菜单</Text>
        <Text style={styles.filter}>筛选</Text>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {HISTORY.map((group, gi) => (
          <View key={gi}>
            <Text style={styles.dayLabel}>{group.day}</Text>
            <View style={styles.group}>
              {group.list.map((it, i) => (
                <Pressable key={i} onPress={() => router.push('/menu/index')} style={({ pressed }) => [styles.row, i > 0 && styles.rowBorder, pressed && { opacity: 0.7 }]}>
                  <View style={[styles.emoji, { backgroundColor: it.bg }]}>
                    <Text style={styles.emojiText}>{it.emoji}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{it.name}</Text>
                    <View style={styles.meta}>
                      <Text style={styles.metaText}>{it.city}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.metaText}>点了 {it.dishes} 道</Text>
                    </View>
                  </View>
                  <Text style={styles.time}>{it.time}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 16, fontWeight: '700', color: C.ink },
  filter: { fontSize: 13, color: C.accent, fontWeight: '500' },
  scroll: { flex: 1 },
  dayLabel: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6, fontSize: 11, color: C.muted, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  group: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  rowBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  emoji: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 22 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: C.ink },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, color: C.muted },
  dot: { width: 2, height: 2, borderRadius: 1, backgroundColor: C.muted2 },
  time: { fontSize: 11, color: C.muted2 },
});
