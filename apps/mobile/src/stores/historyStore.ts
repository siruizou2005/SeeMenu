import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const HISTORY_KEY = "seemenu.history.v1";

export type HistoryEntry = {
  id: string;
  title: string;
  kind: "menu" | "receipt";
  createdAt: string;
};

type HistoryState = {
  entries: HistoryEntry[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  add: (entry: HistoryEntry) => Promise<void>;
  clear: () => Promise<void>;
};

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],
  hydrated: false,
  hydrate: async () => {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    set({ entries: raw ? JSON.parse(raw) as HistoryEntry[] : [], hydrated: true });
  },
  add: async (entry) => {
    const entries = [entry, ...get().entries.filter((item) => item.id !== entry.id)].slice(0, 20);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    set({ entries });
  },
  clear: async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    set({ entries: [] });
  }
}));
