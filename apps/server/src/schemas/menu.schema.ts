import { z } from "zod";

export const dietaryProfileSchema = z.object({
  allergies: z.array(z.string()).default([]),
  religion: z.string().nullable().default(null),
  lifestyle: z.array(z.string()).default([]),
  notes: z.string().default("")
});

export const parsedGeminiMenuSchema = z.object({
  title: z.string().nullable().default(null),
  menu_language: z.string().default("unknown"),
  target_language: z.string().default("zh-CN"),
  currency: z.string().nullable().default(null),
  sections: z.array(z.object({
    id: z.string(),
    source_name: z.string().nullable().default(null),
    chinese_name: z.string().nullable().default(null),
    items: z.array(z.object({
      id: z.string(),
      source_name: z.string().min(1),
      chinese_name: z.string().min(1),
      description_zh: z.string().default(""),
      price: z.number().nullable().default(null),
      price_text: z.string().nullable().default(null),
      ingredients_guess: z.array(z.string()).default([]),
      allergens_guess: z.array(z.string()).default([]),
      dietary_flags: z.array(z.string()).default([]),
      spicy_level: z.number().int().min(0).max(5).nullable().default(null),
      confidence: z.enum(["high", "medium", "low"]).default("medium"),
      bbox_2d: z.tuple([z.number(), z.number(), z.number(), z.number()]).nullable().default(null),
      bbox_confidence: z.enum(["high", "medium", "low"]).default("medium")
    })).default([])
  })).default([]),
  warnings: z.array(z.string()).default([])
});

export type ParsedGeminiMenu = z.infer<typeof parsedGeminiMenuSchema>;
