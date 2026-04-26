import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import C from '../theme';
import Ico from './Icons';

interface CNavProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  back?: boolean;
  onBack?: () => void;
}

export default function CNav({ title, sub, right, back = true, onBack }: CNavProps) {
  const insets = useSafeAreaInsets();
  const handleBack = onBack || (() => router.back());
  return (
    <View style={[styles.nav, { top: insets.top }]}>
      {back ? (
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
          {Ico.back(C.ink, 18)}
        </Pressable>
      ) : (
        <View style={styles.backBtn} />
      )}
      <View style={[styles.center, back ? styles.centerWithBack : null]}>
        <Text style={styles.title}>{title}</Text>
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>
      {right ? right : <View style={styles.backBtn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    left: 0, right: 0,
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.bg,
    zIndex: 5,
  },
  backBtn: {
    width: 28, height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center' },
  centerWithBack: { alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '600', color: C.ink },
  sub: { fontSize: 10, color: C.muted, marginTop: -1 },
});
