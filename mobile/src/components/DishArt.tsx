import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import type { Dish } from '../data';

export default function DishArt({ dish, w = 120, h = 120, rounded = 14 }: { dish: Dish; w?: number; h?: number; rounded?: number }) {
  const [light, dark] = dish.swatch;
  return (
    <View style={{ width: w, height: h, borderRadius: rounded, overflow: 'hidden', flexShrink: 0 }}>
      <LinearGradient colors={[light, dark]} start={{ x: 0.35, y: 0.3 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <Svg width={w} height={h} viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.35 }}>
        <Path d="M30 25 Q35 15 30 5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Path d="M50 22 Q45 12 50 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Path d="M70 25 Q75 15 70 5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      </Svg>
      <LinearGradient
        colors={[light, dark]}
        start={{ x: 0.4, y: 0.35 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: '15%', top: '15%',
          width: w * 0.7, height: w * 0.7,
          borderRadius: (w * 0.7) / 2,
        }}
      />
      <View style={{
        position: 'absolute',
        left: w * 0.52, top: h * 0.48,
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: '#fff', opacity: 0.7,
      }} />
    </View>
  );
}
