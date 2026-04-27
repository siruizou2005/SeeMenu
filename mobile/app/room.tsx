import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CNav from '../src/components/CNav';
import Ico from '../src/components/Icons';
import { ROOM_MEMBERS, MENU_BY_ID, memberName, dishName } from '../src/data';
import { useApp } from '../src/context/AppContext';
import { t } from '../src/i18n';
import C from '../src/theme';

export default function RoomScreen() {
  const { uiLang } = useApp();
  const s = t(uiLang);
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title={s.diningRoom} sub="麺処 つばき" right={
        <Pressable hitSlop={8}>{Ico.share(C.ink, 16)}</Pressable>
      } />

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingTop: 0 }}>
        {/* room code card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>ROOM CODE</Text>
          <Text style={styles.code}>73KQ</Text>
          <Text style={styles.codeHint}>{s.roomCodeHint}</Text>
          <View style={styles.codeActions}>
            <Pressable style={styles.shareBtn}><Text style={styles.shareBtnText}>{s.share}</Text></Pressable>
            <Pressable onPress={() => router.push('/room-qr')} style={styles.qrBtn}><Text style={styles.qrBtnText}>{s.showQR}</Text></Pressable>
          </View>
        </View>

        <View style={styles.membersHeader}>
          <Text style={styles.membersTitle}>{s.roomMembers(ROOM_MEMBERS.length)}</Text>
          <View style={styles.syncStatus}>
            <Text style={styles.syncDot}>●</Text>
            <Text style={styles.syncText}>{s.liveSync}</Text>
          </View>
        </View>

        <View style={styles.membersList}>
          {ROOM_MEMBERS.map((m, i) => (
            <View key={m.id} style={[styles.memberRow, i > 0 && styles.memberRowBorder]}>
              <View style={[styles.avatar, { backgroundColor: m.color }]}>
                <Text style={styles.avatarEmoji}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{memberName(m, uiLang)}</Text>
                  {m.id === 'me' && <Text style={styles.memberYou}>· {s.you}</Text>}
                  <Text style={styles.memberCount}>{s.dishesUnit(m.picks.length)}</Text>
                </View>
                <View style={styles.picks}>
                  {m.picks.map(pid => (
                    <View key={pid} style={styles.pickChip}>
                      <Text style={styles.pickChipText}>{MENU_BY_ID[pid] ? dishName(MENU_BY_ID[pid], uiLang) : pid}</Text>
                    </View>
                  ))}
                  {m.note ? <Text style={styles.memberNote}>※ {m.note}</Text> : null}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.footerLabel}>{s.totalDishes(8)}</Text>
          <Text style={styles.footerTotal}>¥6,640</Text>
        </View>
        <Pressable onPress={() => router.push('/order')} style={styles.orderBtn}>
          <Text style={styles.orderBtnText}>{s.generateOrder}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1, marginTop: 44 },
  codeCard: { backgroundColor: C.ink, borderRadius: 18, padding: 22, marginBottom: 20 },
  codeLabel: { fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 2 },
  code: { fontSize: 40, fontWeight: '700', color: '#fff', letterSpacing: 8, marginTop: 4 },
  codeHint: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 },
  codeActions: { flexDirection: 'row', gap: 8, marginTop: 14 },
  shareBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center' },
  shareBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  qrBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center' },
  qrBtnText: { fontSize: 12, color: C.ink, fontWeight: '600' },
  membersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginHorizontal: 4 },
  membersTitle: { fontSize: 13, fontWeight: '600', color: C.ink },
  syncStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  syncDot: { fontSize: 8, color: C.green },
  syncText: { fontSize: 11, color: C.green },
  membersList: { borderRadius: 12, overflow: 'hidden', borderWidth: 0.5, borderColor: C.line },
  memberRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, backgroundColor: '#fff' },
  memberRowBorder: { borderTopWidth: 0.5, borderTopColor: C.line },
  avatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 14 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  memberName: { fontSize: 14, fontWeight: '600', color: C.ink },
  memberYou: { fontSize: 10, color: C.muted },
  memberCount: { marginLeft: 'auto', fontSize: 11, color: C.muted },
  picks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pickChip: { backgroundColor: C.bg2, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 5 },
  pickChipText: { fontSize: 11, color: C.ink2 },
  memberNote: { fontSize: 10, color: C.accent, paddingVertical: 3 },
  footer: { padding: 16, borderTopWidth: 0.5, borderTopColor: C.line, flexDirection: 'row', alignItems: 'center', gap: 14 },
  footerLabel: { fontSize: 10, color: C.muted },
  footerTotal: { fontSize: 18, fontWeight: '700', color: C.ink },
  orderBtn: { marginLeft: 'auto', backgroundColor: C.ink, paddingHorizontal: 22, paddingVertical: 14, borderRadius: 26 },
  orderBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
