import { View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import type { Dish } from '../data';

const DISH_IMAGES: Record<string, any> = {
  tonkotsu: require('../../assets/dishes/tonkotsu.jpg'),
  shoyu: require('../../assets/dishes/shoyu.jpg'),
  gyoza: require('../../assets/dishes/gyoza.jpg'),
  karaage: require('../../assets/dishes/karaage.jpg'),
  edamame: require('../../assets/dishes/edamame.jpg'),
  tamago: require('../../assets/dishes/tamago.jpg'),
  chashu: require('../../assets/dishes/chashu.jpg'),
  highball: require('../../assets/dishes/highball.jpg'),
  // Café de Flore — Brunch (images: Unsplash / Pexels, bundled)
  oeufs_benedicte: require('../../assets/dishes/flore-oeufs-benedictte.jpg'),
  avocat_saumon: require('../../assets/dishes/flore-avocat-saumon.jpg'),
  croque_monsieur_truffe: require('../../assets/dishes/flore-croque-monsieur.jpg'),
  pancakes_maison: require('../../assets/dishes/flore-pancakes.jpg'),
  pain_perdu_brioche: require('../../assets/dishes/flore-pain-perdu.jpg'),
  granola_maison: require('../../assets/dishes/flore-granola.jpg'),
  viennoiseries: require('../../assets/dishes/flore-viennoiseries.jpg'),
  salade_verte: require('../../assets/dishes/flore-salade-verte.jpg'),
  oeuf_parfait: require('../../assets/dishes/flore-oeuf-parfait.jpg'),
  cafe_allonge: require('../../assets/dishes/flore-cafe.jpg'),
  cappuccino: require('../../assets/dishes/flore-cappuccino.jpg'),
  the_infusions: require('../../assets/dishes/flore-the.jpg'),
  jus_orange: require('../../assets/dishes/flore-jus-orange.jpg'),
  jus_detox: require('../../assets/dishes/flore-jus-detox.jpg'),
  prosecco: require('../../assets/dishes/flore-prosecco.jpg'),
};

export default function DishArt({ dish, w = 120, h = 120, rounded = 14 }: { dish: Dish; w?: number; h?: number; rounded?: number }) {
  const img = DISH_IMAGES[dish.id];
  if (img) {
    return (
      <Image source={img} style={{ width: w, height: h, borderRadius: rounded }} />
    );
  }

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
