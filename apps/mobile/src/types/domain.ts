export type Confidence = "high" | "medium" | "low";

export type DietaryProfile = {
  allergies: string[];
  religion: string | null;
  lifestyle: string[];
  notes: string;
};

export type MenuItem = {
  id: string;
  sectionId: string;
  sectionName: string | null;
  sourceName: string;
  chineseName: string;
  descriptionZh: string;
  price: number | null;
  priceText: string | null;
  ingredientsGuess: string[];
  allergensGuess: string[];
  dietaryFlags: string[];
  spicyLevel: number | null;
  confidence: Confidence;
  bbox2d: [number, number, number, number] | null;
  bboxConfidence: Confidence;
};

export type Menu = {
  id: string;
  scanId: string;
  title: string | null;
  menuLanguage: string;
  targetLanguage: string;
  currency: string | null;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  items: MenuItem[];
  warnings: string[];
  createdAt: string;
};

export type Scan = {
  id: string;
  status: "processing" | "completed" | "failed";
  menuId: string | null;
  imageUrl: string;
  errorMessage?: string;
  createdAt: string;
};

export type CartItem = {
  menuItemId: string;
  quantity: number;
  noteZh: string;
};

export type RoomMember = {
  id: string;
  displayName: string;
  dietaryProfile: DietaryProfile;
  cart: CartItem[];
  ready: boolean;
  joinedAt: string;
};

export type Room = {
  id: string;
  joinCode: string;
  menuId: string;
  targetOrderLanguage: string;
  members: RoomMember[];
  status: "active" | "locked" | "closed";
  totalItems: number;
  createdAt: string;
};

export type Receipt = {
  id: string;
  roomId: string;
  targetLanguage: string;
  targetLanguageText: string;
  chineseText: string;
  safetyNote: string;
  imageUrl: string | null;
  createdAt: string;
};
