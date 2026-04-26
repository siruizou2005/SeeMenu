import { createContext, useContext, useState } from 'react';
import { SAMPLE_MENU, MENU_BY_ID, type Dish } from '../data';

interface CartLine { id: string; qty: number; dish: Dish; note: string }

interface AppContextValue {
  cart: Record<string, number>;
  notes: Record<string, string>;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setNote: (id: string, note: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartLines: CartLine[];
  roomCode: string | null;
  setRoomCode: (code: string | null) => void;
  memberId: string | null;
  setMemberId: (id: string | null) => void;
  nickname: string;
  setNickname: (name: string) => void;
  menuData: typeof SAMPLE_MENU;
  capturedPhoto: string | null;
  setCapturedPhoto: (uri: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [nickname, setNickname] = useState('我');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const addItem = (id: string) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeItem = (id: string) => setCart(c => {
    const next = { ...c };
    if ((next[id] || 0) > 1) next[id]--;
    else delete next[id];
    return next;
  });
  const setNote = (id: string, note: string) => setNotes(n => ({ ...n, [id]: note }));
  const clearCart = () => { setCart({}); setNotes({}); };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const dish = MENU_BY_ID[id];
    if (!dish) return sum;
    return sum + parseInt(dish.price.replace(/[^\d]/g, '')) * qty;
  }, 0);

  const cartLines: CartLine[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({ id, qty, dish: MENU_BY_ID[id], note: notes[id] || '' }));

  return (
    <AppContext.Provider value={{
      cart, notes, addItem, removeItem, setNote, clearCart,
      cartCount, cartTotal, cartLines,
      roomCode, setRoomCode,
      memberId, setMemberId,
      nickname, setNickname,
      menuData: SAMPLE_MENU,
      capturedPhoto, setCapturedPhoto,
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
