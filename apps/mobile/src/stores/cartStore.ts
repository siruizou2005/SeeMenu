import { create } from "zustand";
import type { CartItem, MenuItem } from "@/types/domain";

type CartState = {
  menuId: string | null;
  roomId: string | null;
  memberId: string | null;
  items: CartItem[];
  setSession: (input: { menuId?: string | null; roomId?: string | null; memberId?: string | null }) => void;
  addItem: (item: MenuItem, noteZh?: string) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  setNote: (itemId: string, noteZh: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  menuId: null,
  roomId: null,
  memberId: null,
  items: [],
  setSession: (input) => set((state) => ({ ...state, ...input })),
  addItem: (item, noteZh = "") => set((state) => {
    const existing = state.items.find((candidate) => candidate.menuItemId === item.id && candidate.noteZh === noteZh);
    if (existing) {
      return {
        menuId: state.menuId,
        items: state.items.map((candidate) => candidate === existing ? { ...candidate, quantity: candidate.quantity + 1 } : candidate)
      };
    }
    return {
      menuId: state.menuId,
      items: [...state.items, { menuItemId: item.id, quantity: 1, noteZh }]
    };
  }),
  removeItem: (itemId) => set((state) => ({
    items: state.items.flatMap((item) => {
      if (item.menuItemId !== itemId) return [item];
      if (item.quantity <= 1) return [];
      return [{ ...item, quantity: item.quantity - 1 }];
    })
  })),
  setQuantity: (itemId, quantity) => set((state) => ({
    items: quantity <= 0
      ? state.items.filter((item) => item.menuItemId !== itemId)
      : state.items.map((item) => item.menuItemId === itemId ? { ...item, quantity } : item)
  })),
  setNote: (itemId, noteZh) => set((state) => ({
    items: state.items.map((item) => item.menuItemId === itemId ? { ...item, noteZh } : item)
  })),
  clear: () => set({ items: [], roomId: null, memberId: null })
}));
