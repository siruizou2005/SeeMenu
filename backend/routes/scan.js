import { Router } from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DishRawSchema = z.object({
  orig:    z.string(),
  romaji:  z.string(),
  name:    z.string(),
  price:   z.string(),
  refPrice: z.string(),
  cat:     z.string(),
  blurb:   z.string(),
  tag:     z.enum(['signature', 'popular']).optional(),
});

const LANG_NAME = {
  en: 'English', zh: 'Simplified Chinese', fr: 'French',
  ja: 'Japanese', ko: 'Korean', de: 'German', es: 'Spanish',
};

const REF_CURRENCY = {
  en: 'USD', zh: 'CNY', fr: 'EUR',
  ja: 'JPY', ko: 'KRW', de: 'EUR', es: 'EUR',
};

const REF_RATE = {
  en: '1 USD ≈ 7.2 CNY, 1 JPY ≈ 0.0069 USD, 1 EUR ≈ 1.08 USD',
  zh: '1 JPY ≈ 0.05 CNY, 1 USD ≈ 7.2 CNY, 1 EUR ≈ 7.8 CNY',
  fr: '1 EUR ≈ 1.08 USD, 1 JPY ≈ 0.006 EUR, 1 USD ≈ 0.93 EUR',
  ja: '1 USD ≈ 145 JPY, 1 EUR ≈ 157 JPY, 1 CNY ≈ 20 JPY',
  ko: '1 USD ≈ 1300 KRW, 1 JPY ≈ 9 KRW',
  de: '1 EUR ≈ 1.08 USD, 1 JPY ≈ 0.006 EUR',
  es: '1 EUR ≈ 1.08 USD, 1 JPY ≈ 0.006 EUR',
};

function buildPrompt(targetLang) {
  const lang = LANG_NAME[targetLang] || 'English';
  const currency = REF_CURRENCY[targetLang] || 'USD';
  const rate = REF_RATE[targetLang] || REF_RATE.en;

  return `You are a restaurant menu analyzer. Extract every dish from the image.
Output each dish as a single-line JSON object (JSONL: one object per line, NO array, NO markdown).

IMPORTANT: Your very first line must be a language detection object:
{"detectedLang":"<language_code>","detectedLangName":"<full language name>"}
Where <language_code> is the ISO 639-1 code of the language the menu is written in (e.g. "ja", "zh", "ko", "en", "fr", "de", "es", "th", "vi", etc.).

Then output each dish.

Target language: ${lang}
Reference currency: ${currency} (${rate})

Required fields:
- "orig": exact text as written on the menu (preserve original script)
- "romaji": romanization or phonetic transliteration of the original text
- "name": dish name translated into ${lang}
- "price": exact price as written on the menu
- "refPrice": estimated price in ${currency}, formatted as "${currency === 'CNY' ? '约 ¥' : currency === 'JPY' ? '約 ¥' : currency === 'KRW' ? '약 ₩' : `~${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency}`}XX"
- "cat": dish category in ${lang} (e.g. "Noodles", "Appetizers", "Drinks") — identify the broad category from context
- "blurb": 1-2 sentence description of ingredients and taste in ${lang}
- "tag": ONLY include if clearly marked as featured/recommended — value must be "signature" or "popular"

Output ONLY JSONL lines. Example:
{"detectedLang":"ja","detectedLangName":"Japanese"}
{"orig":"豚骨ラーメン","romaji":"Tonkotsu Ramen","name":"Pork Bone Ramen","price":"¥1,180","refPrice":"~$8","cat":"Noodles","blurb":"Rich pork bone broth simmered 18 hours, served with soft-boiled egg and chashu.","tag":"signature"}`;
}
}

const STEPS_EN = ['Detect', 'Translate', 'Enrich', 'Finalize'];
const STEPS_ZH = ['识别', '翻译', '配图', '整理'];

function getSteps(lang) {
  return lang === 'zh' ? STEPS_ZH : STEPS_EN;
}

function getSwatch(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('noodle') || c.includes('ramen') || c.includes('pasta') || c.includes('麺') || c.includes('拉面')) return ['#f3d9b5', '#c98452'];
  if (c.includes('appetizer') || c.includes('snack') || c.includes('小菜') || c.includes('おつまみ')) return ['#e8c896', '#a86a3a'];
  if (c.includes('topping') || c.includes('extra') || c.includes('加料'))  return ['#f4d590', '#c97a2a'];
  if (c.includes('drink') || c.includes('beverage') || c.includes('ドリンク') || c.includes('飲')) return ['#b8d4e8', '#4a7a9b'];
  if (c.includes('rice') || c.includes('bowl') || c.includes('ご飯') || c.includes('丼'))  return ['#e8a868', '#8a3818'];
  if (c.includes('dessert') || c.includes('sweet')) return ['#f0c0e0', '#a06080'];
  if (c.includes('meat') || c.includes('grill') || c.includes('焼')) return ['#e8a080', '#903020'];
  if (c.includes('seafood') || c.includes('fish') || c.includes('sushi')) return ['#b0d8f0', '#3060a0'];
  return ['#d4c4b0', '#8a7060'];
}

// POST /api/scan/progress
router.post('/progress', upload.single('photo'), async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const emit = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    if (!req.file) { emit({ type: 'error', message: 'no image uploaded' }); return res.end(); }

    const targetLang = req.body?.targetLang || 'en';
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-05-20';
    const STEPS = getSteps(targetLang);

    const stream = await ai.models.generateContentStream({
      model,
      contents: [{ parts: [{ text: buildPrompt(targetLang) }, { inlineData: { data: base64, mimeType } }] }],
    });

    let lineBuffer = '';
    let doneCount = 0;
    let detectedLang = null;
    const allItems = [];

    for await (const chunk of stream) {
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      lineBuffer += text;
      const lines = lineBuffer.split('\n');
      lineBuffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const parsed = JSON.parse(trimmed);
          // Check for language detection line
          if (parsed.detectedLang && !parsed.orig) {
            detectedLang = { code: parsed.detectedLang, name: parsed.detectedLangName || parsed.detectedLang };
            emit({ type: 'detected', lang: detectedLang.code, name: detectedLang.name });
            continue;
          }
          const raw = DishRawSchema.parse(parsed);
          const item = {
            id: `dish_${doneCount}`,
            jp: raw.orig,
            romaji: raw.romaji,
            cn: raw.name,
            price: raw.price,
            cnPrice: raw.refPrice,
            cat: raw.cat,
            blurb: raw.blurb,
            tag: raw.tag,
            swatch: getSwatch(raw.cat),
          };
          allItems.push(item);
          const stepIdx = Math.min(Math.floor(doneCount / 2), STEPS.length - 1);
          emit({ type: 'item', item, done: ++doneCount, step: STEPS[stepIdx], stepIdx });
        } catch { /* skip invalid */ }
      }
    }

    if (lineBuffer?.trim()) {
      try {
        const parsed = JSON.parse(lineBuffer.trim());
        if (parsed.detectedLang && !parsed.orig && !detectedLang) {
          detectedLang = { code: parsed.detectedLang, name: parsed.detectedLangName || parsed.detectedLang };
          emit({ type: 'detected', lang: detectedLang.code, name: detectedLang.name });
        } else {
          const raw = DishRawSchema.parse(parsed);
          const item = {
            id: `dish_${doneCount}`,
            jp: raw.orig, romaji: raw.romaji, cn: raw.name,
            price: raw.price, cnPrice: raw.refPrice,
            cat: raw.cat, blurb: raw.blurb, tag: raw.tag,
            swatch: getSwatch(raw.cat),
          };
          allItems.push(item);
          emit({ type: 'item', item, done: ++doneCount, step: STEPS[3], stepIdx: 3 });
        }
      } catch {}
    }

    emit({ type: 'done', items: allItems, detectedLang: detectedLang?.code || null });
  } catch (err) {
    emit({ type: 'error', message: err.message });
  }

  res.end();
});

export default router;
