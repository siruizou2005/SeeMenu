import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import C from '../../src/theme';
import { useApp } from '../../src/context/AppContext';
import { t } from '../../src/i18n';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history, loadHistory, uiLang } = useApp();
  const s = t(uiLang);

  const grouped = history.reduce<Record<string, typeof history>>((acc, rec) => {
    (acc[rec.date] ??= []).push(rec);
    return acc;
  }, {});
  const days = Object.keys(grouped);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{s.historyTitle}</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📷</Text>
          <Text style={styles.emptyText}>{s.noHistory}</Text>
          <Text style={styles.emptyHint}>{s.noHistoryHint}</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {days.map((day, gi) => (
            <View key={gi}>
              <Text style={styles.dayLabel}>{day}</Text>
              <View style={styles.group}>
                {grouped[day].map((rec, i) => (
                  <Pressable
                    key={rec.id}
                    onPress={() => { loadHistory(rec); router.push('/menu'); }}
                    style={({ pressed }) => [styles.row, i > 0 && styles.rowBorder, pressed && { opacity: 0.7 }]}
                  >
                    <View style={[styles.emojiBox, { backgroundColor: rec.bg }]}>
                      <Text style={styles.emojiText}>{rec.emoji}</Text>
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.name} numberOfLines={1}>{rec.name}</Text>
                      <View style={styles.meta}>
                        <Text style={styles.metaText}>{s.dishesScanned(rec.dishCount)}</Text>
                      </View>
                    </View>
                    <Text style={styles.time}>{rec.time}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg2 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  title: { fontSize: 16, fontWeight: '700', color: C.ink },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: C.ink },
  emptyHint: { fontSize: 12, color: C.muted },
  scroll: { flex: 1 },
  dayLabel: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 6, fontSize: 11, color: C.muted, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  group: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
  rowBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  emojiBox: { width: 48, height: 48, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 22 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: C.ink },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  metaText: { fontSize: 11, color: C.muted },
  time: { fontSize: 11, color: C.muted2 },
});
