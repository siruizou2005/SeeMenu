import type { UILang } from './i18n';

export interface Dish {
  id: string;
  jp: string;
  romaji: string;
  cn: string;
  cnEn?: string;
  price: string;
  cnPrice: string;
  cat: string;
  catEn?: string;
  blurb: string;
  blurbEn?: string;
  tag?: string;
  swatch: [string, string];
}

export function dishName(d: Dish, lang: UILang) { return lang === 'en' && d.cnEn ? d.cnEn : d.cn; }
export function dishBlurb(d: Dish, lang: UILang) { return lang === 'en' && d.blurbEn ? d.blurbEn : d.blurb; }
export function dishCat(d: Dish, lang: UILang) { return lang === 'en' && d.catEn ? d.catEn : d.cat; }

export interface RoomMember {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  color: string;
  picks: string[];
  note: string;
  noteEn: string;
}

export function memberName(m: RoomMember, lang: UILang) { return lang === 'en' ? m.nameEn : m.name; }
export function memberNote(m: RoomMember, lang: UILang) { return lang === 'en' ? m.noteEn : m.note; }

export interface OrderLine {
  id: string;
  qty: number;
  by: string[];
  note: string;
  noteEn: string;
}

export interface HistoryEntry {
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  dishes: number;
  time: string;
  emoji: string;
  bg: string;
}

/** Paris Café de Flore — Brunch (9:00–15:00). Images bundled in assets; ids match `DishArt` DISH_IMAGES. */
export const CAFE_DE_FLORE_MENU: Dish[] = [
  { id: 'oeufs_benedicte', jp: 'Oeufs Bénédicte', romaji: 'Eggs Benedict', cn: '本尼迪克特蛋', cnEn: 'Eggs Benedict', price: '16€', cnPrice: '约 ¥125', cat: 'Les Classiques · 经典', catEn: 'Les Classiques', blurb: '水波蛋、白火腿、荷兰酱、烤乡村面包。', blurbEn: 'Poached eggs, ham, hollandaise, toasted country bread.', swatch: ['#f4e4c8', '#b8860b'] },
  { id: 'avocat_saumon', jp: 'Avocat & Saumon Fumé', romaji: 'Avocado & Smoked Salmon', cn: '牛油果烟熏三文鱼', cnEn: 'Avocado & Smoked Salmon', price: '17€', cnPrice: '约 ¥133', cat: 'Les Classiques · 经典', catEn: 'Les Classiques', blurb: '柠檬味碎牛油果、烟熏三文鱼、水波蛋、芝麻菜、烤全麦面包。', blurbEn: 'Lemon avocado, smoked salmon, poached egg, arugula, wholemeal toast.', swatch: ['#c8e6c9', '#2e7d32'] },
  { id: 'croque_monsieur_truffe', jp: 'Croque-Monsieur Truffé', romaji: 'Truffle Croque-Monsieur', cn: '松露脆皮先生三明治', cnEn: 'Truffle Croque-Monsieur', price: '15€', cnPrice: '约 ¥117', cat: 'Les Classiques · 经典', catEn: 'Les Classiques', tag: 'signature', blurb: '白火腿、孔泰奶酪、松露法式白酱，配一份绿叶沙拉。', blurbEn: 'Ham, Comté, truffle béchamel, green salad on the side.', swatch: ['#efe0c9', '#7d5a3c'] },
  { id: 'pancakes_maison', jp: 'Pancakes Maison', romaji: 'House Pancakes', cn: '自制松饼', cnEn: 'House Pancakes', price: '14€', cnPrice: '约 ¥109', cat: 'Les Gourmands', catEn: 'Les Gourmands', blurb: '枫糖浆、咸黄油、时令水果。', blurbEn: 'Maple syrup, salted butter, seasonal fruit.', swatch: ['#ffe0b2', '#e65100'] },
  { id: 'pain_perdu_brioche', jp: 'Pain Perdu Brioché', romaji: 'Brioche French Toast', cn: '法式布里欧修吐司', cnEn: 'Brioche French Toast', price: '14€', cnPrice: '约 ¥109', cat: 'Les Gourmands', catEn: 'Les Gourmands', blurb: '金黄布里欧修、香草奶油、红莓果。', blurbEn: 'Golden brioche, vanilla cream, red berries.', swatch: ['#d4a574', '#5d4037'] },
  { id: 'granola_maison', jp: 'Granola Maison', romaji: 'House Granola', cn: '自制燕麦片', cnEn: 'House Granola', price: '11€', cnPrice: '约 ¥86', cat: 'Les Gourmands', catEn: 'Les Gourmands', blurb: '希腊酸奶、燕麦、蜂蜜、新鲜水果。', blurbEn: 'Greek yogurt, oats, honey, fresh fruit.', swatch: ['#f0e6d2', '#8d6e63'] },
  { id: 'viennoiseries', jp: 'Viennoiseries', romaji: 'Viennoiseries', cn: '法式维也纳甜点', cnEn: 'Viennoiseries', price: '3€', cnPrice: '约 ¥23', cat: 'À Côté · 配菜', catEn: 'À Côté', blurb: '牛角包、巧克力面包或当日甜点。', blurbEn: 'Croissant, pain au chocolat, or daily pastry.', swatch: ['#ffecb3', '#ff8f00'] },
  { id: 'salade_verte', jp: 'Salade Verte', romaji: 'Green Salad', cn: '绿叶沙拉', cnEn: 'Green Salad', price: '5€', cnPrice: '约 ¥39', cat: 'À Côté · 配菜', catEn: 'À Côté', blurb: '红葱头油醋汁。', blurbEn: 'Shallot vinaigrette.', swatch: ['#c5e1a5', '#33691e'] },
  { id: 'oeuf_parfait', jp: 'Oeuf Parfait', romaji: 'Soft / Poached Egg', cn: '完美蛋', cnEn: 'Soft or Poached Egg', price: '2€', cnPrice: '约 ¥16', cat: 'À Côté · 配菜', catEn: 'À Côté', blurb: '可选水波蛋或软芯蛋。', blurbEn: 'Poached or soft-set egg, your choice.', swatch: ['#fff9c4', '#f9a825'] },
  { id: 'cafe_allonge', jp: 'Café / Allongé', romaji: 'Espresso / Americano', cn: '咖啡 / 美式', cnEn: 'Espresso / Americano', price: '2.5€', cnPrice: '约 ¥20', cat: 'Boissons · 饮品', catEn: 'Boissons', blurb: '意式浓缩或加热水美式。', blurbEn: 'Espresso or long black.', swatch: ['#a1887f', '#3e2723'] },
  { id: 'cappuccino', jp: 'Cappuccino', romaji: 'Cappuccino', cn: '卡布奇诺', cnEn: 'Cappuccino', price: '4.5€', cnPrice: '约 ¥35', cat: 'Boissons · 饮品', catEn: 'Boissons', blurb: '浓缩、蒸奶、奶泡。', blurbEn: 'Espresso, steamed milk, foam.', swatch: ['#d7ccc8', '#4e342e'] },
  { id: 'the_infusions', jp: 'Thé & Infusions', romaji: 'Tea & Infusions', cn: '茶或花草茶', cnEn: 'Tea & Infusions', price: '4€', cnPrice: '约 ¥31', cat: 'Boissons · 饮品', catEn: 'Boissons', blurb: '精选茶与花草茶。', blurbEn: 'Selection of teas and herbal infusions.', swatch: ['#aed581', '#33691e'] },
  { id: 'jus_orange', jp: "Jus d'Orange Frais", romaji: 'Fresh Orange Juice', cn: '鲜榨橙汁', cnEn: 'Fresh Orange Juice', price: '5.5€', cnPrice: '约 ¥43', cat: 'Boissons · 饮品', catEn: 'Boissons', blurb: '鲜榨。', blurbEn: 'Freshly squeezed.', swatch: ['#ffe082', '#f57c00'] },
  { id: 'jus_detox', jp: 'Jus Détox', romaji: 'Detox Juice', cn: '排毒果汁', cnEn: 'Detox Juice', price: '6€', cnPrice: '约 ¥47', cat: 'Boissons · 饮品', catEn: 'Boissons', blurb: '苹果、黄瓜、柠檬、生姜。', blurbEn: 'Apple, cucumber, lemon, ginger.', swatch: ['#c5e1a5', '#558b2f'] },
  { id: 'prosecco', jp: 'Verre de Prosecco', romaji: 'Glass of Prosecco', cn: '普罗塞克起泡酒', cnEn: 'Glass of Prosecco', price: '8€', cnPrice: '约 ¥62', cat: 'Boissons · 饮品', catEn: 'Boissons', blurb: '一杯普罗塞克。', blurbEn: 'One glass of Prosecco.', swatch: ['#e1f5fe', '#0277bd'] },
];

export const SAMPLE_MENU: Dish[] = [
  { id: 'tonkotsu', jp: '豚骨ラーメン', romaji: 'Tonkotsu Ramen', cn: '豚骨拉面', cnEn: 'Pork Bone Ramen', price: '¥1,180', cnPrice: '约 ¥58', cat: '主食 · ラーメン', catEn: 'Noodles', blurb: '熬煮 18 小时的猪骨白汤，浓郁奶白，配溏心蛋、叉烧、海苔。', blurbEn: 'Rich pork bone broth simmered 18 hours, served with soft-boiled egg, chashu, and nori.', tag: '招牌', swatch: ['#f3d9b5', '#c98452'] },
  { id: 'shoyu',    jp: '醤油ラーメン', romaji: 'Shoyu Ramen',    cn: '酱油拉面', cnEn: 'Soy Sauce Ramen', price: '¥1,080', cnPrice: '约 ¥53', cat: '主食 · ラーメン', catEn: 'Noodles', blurb: '清亮酱油汤底，鸡骨与昆布吊汤，口味偏咸鲜。', blurbEn: 'Clear soy-based broth with chicken and kelp stock, savory and balanced.', swatch: ['#d4a574', '#7a4824'] },
  { id: 'gyoza',    jp: '焼き餃子',     romaji: 'Yaki Gyoza',    cn: '煎饺（6 个）', cnEn: 'Pan-fried Gyoza (6 pcs)', price: '¥580', cnPrice: '约 ¥28', cat: '小菜 · おつまみ', catEn: 'Appetizers', blurb: '猪肉白菜馅，底部煎得金黄香脆，配酱油醋。', blurbEn: 'Pork and cabbage filling, pan-fried until golden and crispy, served with soy-vinegar dip.', tag: '热门', swatch: ['#e8c896', '#a86a3a'] },
  { id: 'karaage',  jp: '鶏の唐揚げ',   romaji: 'Tori Karaage', cn: '日式炸鸡块', cnEn: 'Japanese Fried Chicken', price: '¥780', cnPrice: '约 ¥38', cat: '小菜 · おつまみ', catEn: 'Appetizers', blurb: '鸡腿肉腌渍后裹粉炸至外脆内嫩，挤柠檬汁更香。', blurbEn: 'Marinated chicken thigh deep-fried until crispy outside and juicy inside. Squeeze lemon for extra flavor.', swatch: ['#e8b56a', '#8a4a1c'] },
  { id: 'edamame',  jp: '枝豆',         romaji: 'Edamame',       cn: '盐煮毛豆', cnEn: 'Steamed Edamame', price: '¥380', cnPrice: '约 ¥18', cat: '小菜 · おつまみ', catEn: 'Appetizers', blurb: '盐水煮带壳毛豆，居酒屋必点下酒小菜。', blurbEn: 'Lightly salted steamed edamame — an izakaya staple.', swatch: ['#a8c878', '#4a6a28'] },
  { id: 'tamago',   jp: '味付け玉子',   romaji: 'Ajitama',       cn: '溏心卤蛋', cnEn: 'Marinated Soft Egg', price: '¥180', cnPrice: '约 ¥9', cat: '加料 · トッピング', catEn: 'Toppings', blurb: '酱油慢卤，蛋黄半流心，可单点加在拉面里。', blurbEn: 'Slow-marinated in soy sauce with a runny yolk center. Add it to your ramen.', swatch: ['#f4d590', '#c97a2a'] },
  { id: 'chashu',   jp: 'チャーシュー丼', romaji: 'Chashu Don', cn: '叉烧饭', cnEn: 'Chashu Rice Bowl', price: '¥880', cnPrice: '约 ¥43', cat: '主食 · ご飯', catEn: 'Rice', blurb: '炙烤厚切叉烧盖在白米饭上，淋特制酱汁。', blurbEn: 'Thick-cut torched chashu over steamed rice, drizzled with special sauce.', swatch: ['#e8a868', '#8a3818'] },
  { id: 'highball', jp: 'ハイボール',   romaji: 'Highball',      cn: '威士忌苏打', cnEn: 'Whisky Highball', price: '¥480', cnPrice: '约 ¥23', cat: '饮品 · ドリンク', catEn: 'Drinks', blurb: '三得利角瓶威士忌兑苏打水，清爽解腻。', blurbEn: 'Suntory Kakubin whisky with soda water — crisp and refreshing.', swatch: ['#f0d894', '#c8a448'] },
];

export const MENU_BY_ID: Record<string, Dish> = Object.fromEntries(
  [...SAMPLE_MENU, ...CAFE_DE_FLORE_MENU].map(d => [d.id, d])
);

/** 默认展示菜单：花神咖啡馆早午餐；扫图或 `setMenuData` 可切回日料等。 */
export const DEFAULT_MENU = CAFE_DE_FLORE_MENU;

export const ROOM_MEMBERS: RoomMember[] = [
  { id: 'me',   name: '我', nameEn: 'Me',   emoji: '🧑', color: '#E8743C', picks: ['tonkotsu', 'gyoza', 'tamago'], note: '不要葱', noteEn: 'No spring onion' },
  { id: 'lily', name: 'Lily', nameEn: 'Lily', emoji: '👩', color: '#D4A574', picks: ['shoyu', 'edamame'], note: '', noteEn: '' },
  { id: 'ken',  name: 'Ken',  nameEn: 'Ken',  emoji: '👦', color: '#6A8C5C', picks: ['karaage', 'chashu', 'highball'], note: '炸鸡多挤柠檬', noteEn: 'Extra lemon on chicken' },
];

export const FINAL_ORDER: OrderLine[] = [
  { id: 'tonkotsu', qty: 1, by: ['我'],   note: '不要葱 / ねぎ抜き', noteEn: 'No spring onion / ねぎ抜き' },
  { id: 'shoyu',    qty: 1, by: ['Lily'], note: '', noteEn: '' },
  { id: 'gyoza',    qty: 1, by: ['我'],   note: '', noteEn: '' },
  { id: 'karaage',  qty: 1, by: ['Ken'],  note: '柠檬多 / レモン多め', noteEn: 'Extra lemon / レモン多め' },
  { id: 'edamame',  qty: 1, by: ['Lily'], note: '', noteEn: '' },
  { id: 'chashu',   qty: 1, by: ['Ken'],  note: '', noteEn: '' },
  { id: 'tamago',   qty: 2, by: ['我'],   note: '加在拉面里', noteEn: 'Add to ramen' },
  { id: 'highball', qty: 1, by: ['Ken'],  note: '', noteEn: '' },
];

export const HISTORY: { day: string; dayEn: string; list: HistoryEntry[] }[] = [
  { day: '今天', dayEn: 'Today', list: [
    { name: '麺処 つばき', nameEn: 'Men-dokoro Tsubaki', city: '东京 · 涩谷', cityEn: 'Tokyo · Shibuya', dishes: 4, time: '12:34', emoji: '🍜', bg: '#FFF1EB' },
  ]},
  { day: '昨天', dayEn: 'Yesterday', list: [
    { name: 'すし匠', nameEn: 'Sushi Taku', city: '东京 · 银座', cityEn: 'Tokyo · Ginza', dishes: 6, time: '19:20', emoji: '🍣', bg: '#EAF4FF' },
    { name: 'スターバックス', nameEn: 'Starbucks', city: '东京 · 表参道', cityEn: 'Tokyo · Omotesando', dishes: 2, time: '15:08', emoji: '☕', bg: '#F1ECE3' },
  ]},
  { day: '11 月 8 日', dayEn: 'Nov 8', list: [
    { name: '焼肉 牛角', nameEn: 'Gyukaku Yakiniku', city: '京都', cityEn: 'Kyoto', dishes: 8, time: '20:15', emoji: '🥩', bg: '#FFEAEA' },
    { name: 'ラーメン 一蘭', nameEn: 'Ichiran Ramen', city: '大阪', cityEn: 'Osaka', dishes: 3, time: '21:40', emoji: '🍜', bg: '#FFF1EB' },
  ]},
];
