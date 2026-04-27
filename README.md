# SeeMenu

**Hackathon · 2026**

SeeMenu is an AI-powered menu translation and collaborative ordering app for international travelers. Snap a photo of any foreign-language menu and the app instantly recognizes dishes, translates descriptions, flags allergens and dietary risks, and lets your whole group order together — generating a final receipt in the restaurant's local language, ready to show the server.

---

## How It Works

1. A traveler enters a restaurant and photographs the paper menu.
2. **SeeMenu** sends the image through a two-step Gemini pipeline:
   - **Step 1 — OCR & Layout**: Gemini identifies dish names, prices, categories, and bounding-box positions on the image (normalized 0–1000 coordinates).
   - **Step 2 — Enrichment & Translation**: A second Gemini call translates names to Chinese, infers ingredients and allergens, assigns dietary flags, and checks against each diner's personal dietary profile.
3. An interactive menu page is displayed with image hotspots, Chinese explanations, and risk warnings.
4. Travel companions join via a **room join code** and each build their own cart with personal dietary notes.
5. When everyone is ready, the system consolidates the order and generates a **bilingual receipt** — translated into the restaurant's local language for the server, plus Chinese for the diners.

---

## Project Structure

```
seemenu/
├── apps/
│   ├── server/                  # New TypeScript server (Fastify + SQLite)
│   │   └── src/
│   │       ├── routes/          # menu, room, receipt endpoints
│   │       ├── services/        # gemini.service.ts, menu.service.ts, receipt.service.ts
│   │       ├── schemas/         # Zod schemas (menu.schema.ts)
│   │       ├── db.ts            # better-sqlite3 database layer
│   │       ├── store.ts         # in-memory room/scan state
│   │       ├── types.ts         # shared domain types
│   │       └── env.ts           # environment config
│   └── mobile/                  # New Expo 53 / React Native 0.79 app
│       ├── app/
│       │   ├── (tabs)/          # Bottom tabs: Home, History, Profile
│       │   ├── scan/[scanId]    # Scan processing screen
│       │   ├── menu/[menuId]    # Menu viewer with image hotspots
│       │   ├── dish/[itemId]    # Dish detail page
│       │   ├── room/[roomId]    # Collaborative room + QR code
│       │   ├── receipt/[id]     # Receipt display and share
│       │   ├── cart.tsx
│       │   ├── join-room.tsx
│       │   ├── camera.tsx
│       │   ├── photo-review.tsx
│       │   ├── history.tsx
│       │   ├── profile.tsx
│       │   └── settings.tsx
│       └── src/
│           ├── api/             # Typed API clients (menu, room, receipt)
│           ├── components/      # DishCard, MenuImageHotspots, ReceiptCard, …
│           ├── stores/          # Zustand stores (cart, history, profile)
│           ├── design/          # Design tokens (colors, spacing, typography, …)
│           ├── types/           # domain.ts
│           └── utils/           # dietary.ts helpers
├── backend/                     # Legacy Express backend (original prototype)
├── mobile/                      # Legacy Expo app (original prototype)
├── frontend/                    # Legacy React + Vite web frontend
├── start.sh                     # One-command start (legacy stack)
└── .env.example
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native 0.79 / Expo 53 (iOS & Android) |
| State management | Zustand 5 · TanStack Query 5 |
| Server | Fastify 5 · TypeScript · Node.js |
| Database | SQLite via `better-sqlite3` |
| AI — OCR & Translation | Google Gemini API (`gemini-2.5-flash`) — two-step pipeline |
| Image processing | `sharp` (resize, metadata extraction) |
| Validation | Zod |
| Collaborative ordering | Room join code · long-polling |
| QR code | `react-native-qrcode-svg` |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Google [Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Configure environment

```bash
cp .env.example .env
# Fill in GEMINI_API_KEY and other values
```

### 2. Start the new server (`apps/server`)

```bash
cd apps/server
npm install
npm run dev
```

Server starts on `http://localhost:3001` by default.

### 3. Start the new mobile app (`apps/mobile`)

```bash
cd apps/mobile
npm install
npx expo start
```

For physical-device testing, set `EXPO_PUBLIC_API_URL` in `.env` to your machine's LAN IP, e.g. `http://192.168.x.x:3001`.

### 4. (Legacy) Start the original web + backend stack

```bash
bash start.sh
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | *(required for AI features)* |
| `GEMINI_MODEL` | Gemini model to use | `gemini-2.5-flash` |
| `PORT` | Server port | `3001` |
| `HOST` | Server bind host | `0.0.0.0` |
| `PUBLIC_BASE_URL` | Public URL of the server (used for image URLs) | `http://localhost:3001` |
| `DATA_DIR` | Directory for SQLite DB, uploaded images, and receipts | `apps/server/data` |
| `EXPO_PUBLIC_API_URL` | Backend URL used by the mobile app | `http://localhost:3001` |

> **No API key?** The server falls back to bundled sample menu data so you can develop and test the UI without a Gemini key.

---

## Key Features

### Two-Step AI Pipeline
Menu images go through two separate Gemini calls to separate concerns: the first pass is a fast OCR + layout pass (no translation, no guessing); the second pass enriches with translations, ingredient inference, allergen guesses, and dietary flags — keeping each step's prompt focused and the outputs reliable.

### Image Hotspots
Each recognized dish stores a bounding box (`bbox_2d`) on the original menu image. The mobile app overlays interactive tap targets on the photo so users can tap a dish directly on the menu image to see its details.

### Dietary Profiles
Every room member has a personal dietary profile (allergies, religion, lifestyle, free-text notes). Gemini's enrichment step checks each dish against the active user's profile and the receipt generator includes all members' restrictions in the translated order.

### Collaborative Rooms
One person scans and creates a room; others join via a 6-character code or QR code. Each member maintains their own cart and dietary notes. The room can be locked when ordering begins and a shared receipt is generated.

### Bilingual Receipt
The final order is translated into the restaurant's local language for showing to the server, while the Chinese version remains available for the diners to review. Per-item dietary notes and allergen warnings are included in the translation.

---

## Notes

- Allergen and dietary risk information is provided as AI inference only. Always confirm directly with restaurant staff before ordering.
- The bounding-box coordinates returned by Gemini are estimates; confidence levels (`high` / `medium` / `low`) are included for both the dish recognition and the bbox position.
- The `apps/` directory contains the current production-targeted codebase. The top-level `backend/`, `mobile/`, and `frontend/` directories are the original hackathon prototype and remain for reference.
