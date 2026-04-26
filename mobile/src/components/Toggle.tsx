import { Pressable, View, StyleSheet } from 'react-native';
import C from '../theme';

export default function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onChange(!on)} style={[styles.track, on && styles.trackOn]}>
      <View style={[styles.thumb, on && styles.thumbOn]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44, height: 26, borderRadius: 13,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: C.green },
  thumb: {
    position: 'absolute',
    left: 2, width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 2,
    elevation: 2,
  },
  thumbOn: { left: 20 },
});
