export interface Dish {
  id: string;
  jp: string;
  romaji: string;
  cn: string;
  price: string;
  cnPrice: string;
  cat: string;
  blurb: string;
  tag?: string;
  swatch: [string, string];
}

export interface RoomMember {
  id: string;
  name: string;
  emoji: string;
  color: string;
  picks: string[];
  note: string;
}

export interface OrderLine {
  id: string;
  qty: number;
  by: string[];
  note: string;
}

export interface HistoryEntry {
  name: string;
  city: string;
  dishes: number;
  time: string;
  emoji: string;
  bg: string;
}

export const SAMPLE_MENU: Dish[] = [
  { id: 'tonkotsu', jp: '豚骨ラーメン', romaji: 'Tonkotsu Ramen', cn: '豚骨拉面', price: '¥1,180', cnPrice: '约 ¥58', cat: '主食 · ラーメン', blurb: '熬煮 18 小时的猪骨白汤，浓郁奶白，配溏心蛋、叉烧、海苔。', tag: '招牌', swatch: ['#f3d9b5', '#c98452'] },
  { id: 'shoyu',    jp: '醤油ラーメン', romaji: 'Shoyu Ramen',    cn: '酱油拉面', price: '¥1,080', cnPrice: '约 ¥53', cat: '主食 · ラーメン', blurb: '清亮酱油汤底，鸡骨与昆布吊汤，口味偏咸鲜。', swatch: ['#d4a574', '#7a4824'] },
  { id: 'gyoza',    jp: '焼き餃子',     romaji: 'Yaki Gyoza',    cn: '煎饺（6 个）', price: '¥580', cnPrice: '约 ¥28', cat: '小菜 · おつまみ', blurb: '猪肉白菜馅，底部煎得金黄香脆，配酱油醋。', tag: '热门', swatch: ['#e8c896', '#a86a3a'] },
  { id: 'karaage',  jp: '鶏の唐揚げ',   romaji: 'Tori Karaage', cn: '日式炸鸡块', price: '¥780', cnPrice: '约 ¥38', cat: '小菜 · おつまみ', blurb: '鸡腿肉腌渍后裹粉炸至外脆内嫩，挤柠檬汁更香。', swatch: ['#e8b56a', '#8a4a1c'] },
  { id: 'edamame',  jp: '枝豆',         romaji: 'Edamame',       cn: '盐煮毛豆', price: '¥380', cnPrice: '约 ¥18', cat: '小菜 · おつまみ', blurb: '盐水煮带壳毛豆，居酒屋必点下酒小菜。', swatch: ['#a8c878', '#4a6a28'] },
  { id: 'tamago',   jp: '味付け玉子',   romaji: 'Ajitama',       cn: '溏心卤蛋', price: '¥180', cnPrice: '约 ¥9', cat: '加料 · トッピング', blurb: '酱油慢卤，蛋黄半流心，可单点加在拉面里。', swatch: ['#f4d590', '#c97a2a'] },
  { id: 'chashu',   jp: 'チャーシュー丼', romaji: 'Chashu Don', cn: '叉烧饭', price: '¥880', cnPrice: '约 ¥43', cat: '主食 · ご飯', blurb: '炙烤厚切叉烧盖在白米饭上，淋特制酱汁。', swatch: ['#e8a868', '#8a3818'] },
  { id: 'highball', jp: 'ハイボール',   romaji: 'Highball',      cn: '威士忌苏打', price: '¥480', cnPrice: '约 ¥23', cat: '饮品 · ドリンク', blurb: '三得利角瓶威士忌兑苏打水，清爽解腻。', swatch: ['#f0d894', '#c8a448'] },
];

export const MENU_BY_ID: Record<string, Dish> = Object.fromEntries(SAMPLE_MENU.map(d => [d.id, d]));

export const ROOM_MEMBERS: RoomMember[] = [
  { id: 'me',   name: '我',   emoji: '🧑', color: '#E8743C', picks: ['tonkotsu', 'gyoza', 'tamago'], note: '不要葱' },
  { id: 'lily', name: 'Lily', emoji: '👩', color: '#D4A574', picks: ['shoyu', 'edamame'], note: '' },
  { id: 'ken',  name: 'Ken',  emoji: '👦', color: '#6A8C5C', picks: ['karaage', 'chashu', 'highball'], note: '炸鸡多挤柠檬' },
];

export const FINAL_ORDER: OrderLine[] = [
  { id: 'tonkotsu', qty: 1, by: ['我'],   note: '不要葱 / ねぎ抜き' },
  { id: 'shoyu',    qty: 1, by: ['Lily'], note: '' },
  { id: 'gyoza',    qty: 1, by: ['我'],   note: '' },
  { id: 'karaage',  qty: 1, by: ['Ken'],  note: '柠檬多 / レモン多め' },
  { id: 'edamame',  qty: 1, by: ['Lily'], note: '' },
  { id: 'chashu',   qty: 1, by: ['Ken'],  note: '' },
  { id: 'tamago',   qty: 2, by: ['我'],   note: '加在拉面里' },
  { id: 'highball', qty: 1, by: ['Ken'],  note: '' },
];

export const HISTORY: { day: string; list: HistoryEntry[] }[] = [
  { day: '今天', list: [
    { name: '麺処 つばき', city: '东京 · 涩谷', dishes: 4, time: '12:34', emoji: '🍜', bg: '#FFF1EB' },
  ]},
  { day: '昨天', list: [
    { name: 'すし匠',       city: '东京 · 银座', dishes: 6, time: '19:20', emoji: '🍣', bg: '#EAF4FF' },
    { name: 'スターバックス', city: '东京 · 表参道', dishes: 2, time: '15:08', emoji: '☕', bg: '#F1ECE3' },
  ]},
  { day: '11 月 8 日', list: [
    { name: '焼肉 牛角', city: '京都', dishes: 8, time: '20:15', emoji: '🥩', bg: '#FFEAEA' },
    { name: 'ラーメン 一蘭', city: '大阪', dishes: 3, time: '21:40', emoji: '🍜', bg: '#FFF1EB' },
  ]},
];
