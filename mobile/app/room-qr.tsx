import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Circle } from 'react-native-svg';
import Ico from '../src/components/Icons';
import C from '../src/theme';

export default function RoomQRScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFillObject} onPress={() => router.back()} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>邀请朋友加入</Text>
        <Text style={styles.sub}>扫码即可看到同一份菜单</Text>

        {/* QR placeholder */}
        <View style={styles.qrWrap}>
          <Svg width={172} height={172} viewBox="0 0 172 172">
            {/* grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <Rect key={`h${i}`} x={0} y={i * 9} width={172} height={0.5} fill={C.line} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <Rect key={`v${i}`} x={i * 9} y={0} width={0.5} height={172} fill={C.line} />
            ))}
            {/* corners */}
            <Rect x={4} y={4} width={36} height={36} rx={4} stroke={C.ink} strokeWidth={4} fill="#fff" />
            <Rect x={10} y={10} width={12} height={12} rx={1} fill={C.ink} />
            <Rect x={132} y={4} width={36} height={36} rx={4} stroke={C.ink} strokeWidth={4} fill="#fff" />
            <Rect x={138} y={10} width={12} height={12} rx={1} fill={C.ink} />
            <Rect x={4} y={132} width={36} height={36} rx={4} stroke={C.ink} strokeWidth={4} fill="#fff" />
            <Rect x={10} y={138} width={12} height={12} rx={1} fill={C.ink} />
            {/* center logo */}
            <Rect x={72} y={72} width={28} height={28} rx={6} fill={C.accent} />
            <Circle cx={86} cy={86} r={14} fill="none" stroke="#fff" strokeWidth={2} />
          </Svg>
          <View style={styles.logoOverlay}><Text style={styles.logoText}>看</Text></View>
        </View>

        <Text style={styles.codeLabel}>ROOM CODE</Text>
        <Text style={styles.code}>73KQ</Text>

        <View style={styles.actions}>
          <Pressable style={styles.wechatBtn}>
            {Ico.share(C.ink, 14)}
            <Text style={styles.wechatBtnText}>微信分享</Text>
          </Pressable>
          <Pressable style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>保存图片</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, alignItems: 'center' },
  handle: { width: 36, height: 4, backgroundColor: C.line, borderRadius: 2, marginBottom: 18 },
  title: { fontSize: 18, fontWeight: '700', color: C.ink },
  sub: { fontSize: 12, color: C.muted, marginTop: 4, marginBottom: 24 },
  qrWrap: { width: 200, height: 200, padding: 14, borderWidth: 1, borderColor: C.line, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  logoOverlay: { position: 'absolute', width: 36, height: 36, borderRadius: 10, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff' },
  logoText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  codeLabel: { fontSize: 11, color: C.muted, letterSpacing: 2, marginTop: 18 },
  code: { fontSize: 28, fontWeight: '700', color: C.ink, letterSpacing: 6, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 24, width: '100%' },
  wechatBtn: { flex: 1, height: 44, borderRadius: 22, backgroundColor: C.bg2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  wechatBtnText: { fontSize: 13, fontWeight: '600', color: C.ink },
  saveBtn: { flex: 1, height: 44, borderRadius: 22, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
