import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { DietaryProfile } from "@/types/domain";

const PROFILE_KEY = "seemenu.profile.v1";

type ProfileState = {
  displayName: string;
  dietaryProfile: DietaryProfile;
  hydrated: boolean;
  onboarded: boolean;
  hydrate: () => Promise<void>;
  save: (displayName: string, profile: DietaryProfile) => Promise<void>;
  reset: () => Promise<void>;
};

const emptyProfile: DietaryProfile = {
  allergies: [],
  religion: null,
  lifestyle: [],
  notes: ""
};

export const useProfileStore = create<ProfileState>((set) => ({
  displayName: "我",
  dietaryProfile: emptyProfile,
  hydrated: false,
  onboarded: false,
  hydrate: async () => {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (!raw) {
      set({ hydrated: true });
      return;
    }
    const parsed = JSON.parse(raw) as { displayName: string; dietaryProfile: DietaryProfile };
    set({ ...parsed, hydrated: true, onboarded: true });
  },
  save: async (displayName, dietaryProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify({ displayName, dietaryProfile }));
    set({ displayName, dietaryProfile, onboarded: true });
  },
  reset: async () => {
    await AsyncStorage.removeItem(PROFILE_KEY);
    set({ displayName: "我", dietaryProfile: emptyProfile, onboarded: false });
  }
}));
