import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CNav from '../src/components/CNav';
import Ico from '../src/components/Icons';
import C from '../src/theme';

const KEYS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']];

export default function JoinRoomScreen() {
  const [code, setCode] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (code.length === 4) {
      const t = setTimeout(() => router.push('/room'), 300);
      return () => clearTimeout(t);
    }
  }, [code]);

  const handleKey = (k: string) => {
    if (k === '⌫') setCode(c => c.slice(0, -1));
    else if (k === '') return;
    else if (code.length < 4) setCode(c => c + k);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <CNav title="加入房间" />
      <View style={styles.body}>
        <Text style={styles.title}>输入房间码</Text>
        <Text style={styles.sub}>请向已经在房间的朋友要 4 位房间码</Text>

        <View style={styles.boxes}>
          {[0, 1, 2, 3].map(i => {
            const char = code[i] || '';
            const isCurrent = i === code.length;
            return (
              <View key={i} style={[styles.box, char ? styles.boxFilled : styles.boxEmpty, isCurrent && styles.boxActive]}>
                <Text style={styles.boxChar}>{char}</Text>
                {isCurrent && !char && <View style={styles.cursor} />}
              </View>
            );
          })}
        </View>

        <Pressable style={styles.scanRow}>
          <View style={styles.scanIcon}>{Ico.scan(C.ink, 16)}</View>
          <View style={{ flex: 1 }}>
            <Text style={styles.scanTitle}>扫描朋友的二维码</Text>
            <Text style={styles.scanSub}>更快、不会输错</Text>
          </View>
          <Text style={styles.scanArrow}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.keypad, { paddingBottom: insets.bottom + 8 }]}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.keyRow}>
            {row.map((k, ki) => (
              <Pressable key={ki} onPress={() => handleKey(k)} style={({ pressed }) => [styles.key, k === '' && styles.keyEmpty, pressed && k !== '' && styles.keyPressed]}>
                <Text style={styles.keyText}>{k}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 74 },
  title: { fontSize: 24, fontWeight: '700', color: C.ink, letterSpacing: -0.4 },
  sub: { fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 20 },
  boxes: { flexDirection: 'row', gap: 10, marginTop: 32, justifyContent: 'center' },
  box: { width: 56, height: 64, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5 },
  boxEmpty: { backgroundColor: C.bg2, borderColor: 'transparent' },
  boxFilled: { backgroundColor: '#fff', borderColor: C.line },
  boxActive: { borderColor: C.accent },
  boxChar: { fontSize: 28, fontWeight: '700', color: C.ink },
  cursor: { width: 2, height: 26, backgroundColor: C.accent, position: 'absolute' },
  scanRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28, padding: 14, backgroundColor: C.bg2, borderRadius: 12 },
  scanIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  scanTitle: { fontSize: 13, fontWeight: '600', color: C.ink },
  scanSub: { fontSize: 11, color: C.muted, marginTop: 1 },
  scanArrow: { fontSize: 16, color: C.muted2 },
  keypad: { backgroundColor: C.bg3, paddingTop: 8 },
  keyRow: { flexDirection: 'row' },
  key: { flex: 1, height: 44, margin: 4, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keyEmpty: { backgroundColor: 'transparent' },
  keyPressed: { opacity: 0.6 },
  keyText: { fontSize: 22, fontWeight: '500', color: C.ink },
});
