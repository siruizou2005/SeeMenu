import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getInfoAsync, readAsStringAsync, writeAsStringAsync, documentDirectory } from 'expo-file-system/legacy';
import { DEFAULT_MENU, type Dish } from '../data';
import { type UILang, type TargetLang, t } from '../i18n';

const HISTORY_PATH = (documentDirectory ?? '') + 'history.json';

async function loadHistoryFromDisk(): Promise<HistoryRecord[]> {
  try {
    const info = await getInfoAsync(HISTORY_PATH);
    if (!info.exists) return [];
    const raw = await readAsStringAsync(HISTORY_PATH);
    return JSON.parse(raw);
  } catch { return []; }
}

async function saveHistoryToDisk(history: HistoryRecord[]) {
  try {
    await writeAsStringAsync(HISTORY_PATH, JSON.stringify(history));
  } catch {}
}

interface CartLine { id: string; qty: number; dish: Dish; note: string }

export interface HistoryRecord {
  id: string;
  name: string;
  dishCount: number;
  time: string;
  date: string;
  emoji: string;
  bg: string;
  dishes: Dish[];
}

export interface AuthUser { id: string; username: string; token: string; lang?: string }

interface AppContextValue {
  // auth
  user: AuthUser | null;
  authLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  // cart
  cart: Record<string, number>;
  notes: Record<string, string>;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setNote: (id: string, note: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartCnTotal: number;
  currencySymbol: string;
  cartLines: CartLine[];
  // room
  roomCode: string | null;
  setRoomCode: (code: string | null) => void;
  memberId: string | null;
  setMemberId: (id: string | null) => void;
  nickname: string;
  setNickname: (name: string) => void;
  // menu
  menuData: Dish[];
  setMenuData: (dishes: Dish[]) => void;
  capturedPhoto: string | null;
  setCapturedPhoto: (uri: string | null) => void;
  // history
  history: HistoryRecord[];
  addHistory: (dishes: Dish[]) => void;
  loadHistory: (record: HistoryRecord) => void;
  // language
  uiLang: UILang;
  setUiLang: (lang: UILang) => void;
  targetLang: TargetLang;
  setTargetLang: (lang: TargetLang) => void;
  detectedLang: string | null;
  setDetectedLang: (lang: string | null) => void;
}

function pickEmoji(dishes: Dish[]): { emoji: string; bg: string } {
  const cats = dishes.map(d => d.cat).join(' ');
  if (cats.includes('Boissons') || cats.includes('Café')) return { emoji: '☕', bg: '#F1ECE3' };
  if (cats.includes('Les Classiques') || cats.includes('Gourmands') || cats.includes('À Côté')) return { emoji: '🥐', bg: '#FFF8F0' };
  if (cats.includes('ラーメン') || cats.includes('麺')) return { emoji: '🍜', bg: '#FFF1EB' };
  if (cats.includes('寿司') || cats.includes('すし'))  return { emoji: '🍣', bg: '#EAF4FF' };
  if (cats.includes('ドリンク') || cats.includes('飲')) return { emoji: '🍵', bg: '#F1ECE3' };
  if (cats.includes('焼肉') || cats.includes('肉'))    return { emoji: '🥩', bg: '#FFEAEA' };
  if (cats.includes('ご飯') || cats.includes('丼'))    return { emoji: '🍚', bg: '#FFFBE6' };
  return { emoji: '🍽️', bg: '#F4F0EC' };
}

const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('我');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<Dish[]>(DEFAULT_MENU);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [uiLang, setUiLangState] = useState<UILang>('en');
  const [targetLang, setTargetLangState] = useState<TargetLang>('en');
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  const setUiLang = (lang: UILang) => { setUiLangState(lang); SecureStore.setItemAsync('ui_lang', lang); };
  const setTargetLang = (lang: TargetLang) => { setTargetLangState(lang); SecureStore.setItemAsync('target_lang', lang); };

  // restore history and language prefs from disk on launch
  useEffect(() => {
    loadHistoryFromDisk().then(h => { setHistory(h); setHistoryLoaded(true); });
    SecureStore.getItemAsync('ui_lang').then(v => { if (v) setUiLangState(v as UILang); });
    SecureStore.getItemAsync('target_lang').then(v => { if (v) setTargetLangState(v as TargetLang); });
  }, []);

  // persist history to disk whenever it changes (skip initial empty state)
  useEffect(() => {
    if (historyLoaded) saveHistoryToDisk(history);
  }, [history, historyLoaded]);

  // restore token on launch
  useEffect(() => {
    SecureStore.getItemAsync('auth_user').then(raw => {
      if (raw) {
        const saved: AuthUser = JSON.parse(raw);
        fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${saved.token}` } })
          .then(r => r.ok ? r.json() : Promise.reject())
          .then((data) => {
            setUser({ id: data.id, username: data.username, token: saved.token, lang: data.lang });
            if (data.lang === 'en' || data.lang === 'zh') setUiLangState(data.lang);
          })
          .catch(() => SecureStore.deleteItemAsync('auth_user'))
          .finally(() => setAuthLoading(false));
      } else {
        setAuthLoading(false);
      }
    });
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? t(uiLang).loginFailed);
    const authUser: AuthUser = { id: data.id, username: data.username, token: data.token, lang: data.lang };
    setUser(authUser);
    if (data.lang === 'en' || data.lang === 'zh') setUiLang(data.lang);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(authUser));
  };

  const register = async (username: string, password: string) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, lang: uiLang }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? t(uiLang).registerFailed);
    const authUser: AuthUser = { id: data.id, username: data.username, token: data.token, lang: data.lang };
    setUser(authUser);
    await SecureStore.setItemAsync('auth_user', JSON.stringify(authUser));
  };

  const logout = async () => {
    setUser(null);
    setCart({});
    setNotes({});
    setHistory([]);
    await SecureStore.deleteItemAsync('auth_user');
    await saveHistoryToDisk([]);
  };

  const menuById = useMemo(() => Object.fromEntries(menuData.map(d => [d.id, d])), [menuData]);

  const addItem = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id: string) => setCart(c => {
    const next = { ...c };
    if ((next[id] || 0) > 1) next[id]--;
    else delete next[id];
    return next;
  });
  const setNote = (id: string, note: string) => setNotes(n => ({ ...n, [id]: note }));
  const clearCart = () => { setCart({}); setNotes({}); };

  const addHistory = (dishes: Dish[]) => {
    const s = t(uiLang);
    const now = new Date();
    const locale = uiLang === 'zh' ? 'zh-CN' : 'en-US';
    const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString(locale, { month: 'numeric', day: 'numeric' });
    const { emoji, bg } = pickEmoji(dishes);
    const record: HistoryRecord = {
      id: String(now.getTime()),
      name: s.scanHistoryName,
      dishCount: dishes.length,
      time, date, emoji, bg, dishes,
    };
    setHistory(prev => [record, ...prev]);
  };

  const loadHistory = (record: HistoryRecord) => {
    setMenuData(record.dishes);
    setCart({});
    setNotes({});
  };

  const currencySymbol = useMemo(() => {
    const price = menuData[0]?.price ?? '';
    if (price.includes('$')) return '$';
    if (price.includes('€')) return '€';
    if (price.includes('£')) return '£';
    return '¥';
  }, [menuData]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const dish = menuById[id];
    if (!dish) return sum;
    return sum + parseFloat(dish.price.replace(/[^\d.]/g, '') || '0') * qty;
  }, 0);

  const cartCnTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const dish = menuById[id];
    if (!dish) return sum;
    const cn = parseFloat(dish.cnPrice.replace(/[^\d.]/g, '') || '0');
    return sum + cn * qty;
  }, 0);

  const cartLines: CartLine[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ id, qty, dish: menuById[id], note: notes[id] || '' }))
    .filter(l => l.dish != null);

  return (
    <AppContext.Provider value={{
      user, authLoading, login, register, logout,
      cart, notes, addItem, removeItem, setNote, clearCart,
      cartCount, cartTotal, cartCnTotal, currencySymbol, cartLines,
      roomCode, setRoomCode,
      memberId, setMemberId,
      nickname, setNickname,
      menuData, setMenuData,
      capturedPhoto, setCapturedPhoto,
      history, addHistory, loadHistory,
      uiLang, setUiLang, targetLang, setTargetLang,
      detectedLang, setDetectedLang,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
