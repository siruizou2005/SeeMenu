import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../env.js";
import { parsedGeminiMenuSchema, type ParsedGeminiMenu } from "../schemas/menu.schema.js";
import type { DietaryProfile, MenuItem, RoomMember } from "../types.js";
import { sampleParsedMenu } from "./sampleMenu.js";

const menuResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, nullable: true },
    menu_language: { type: Type.STRING },
    target_language: { type: Type.STRING },
    currency: { type: Type.STRING, nullable: true },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          source_name: { type: Type.STRING, nullable: true },
          chinese_name: { type: Type.STRING, nullable: true },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                source_name: { type: Type.STRING },
                chinese_name: { type: Type.STRING },
                description_zh: { type: Type.STRING },
                price: { type: Type.NUMBER, nullable: true },
                price_text: { type: Type.STRING, nullable: true },
                ingredients_guess: { type: Type.ARRAY, items: { type: Type.STRING } },
                allergens_guess: { type: Type.ARRAY, items: { type: Type.STRING } },
                dietary_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                spicy_level: { type: Type.NUMBER, nullable: true },
                confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
                bbox_2d: {
                  type: Type.ARRAY,
                  nullable: true,
                  minItems: 4,
                  maxItems: 4,
                  items: { type: Type.NUMBER }
                },
                bbox_confidence: { type: Type.STRING, enum: ["high", "medium", "low"] }
              },
              required: ["id", "source_name", "chinese_name", "description_zh", "confidence", "bbox_confidence"]
            }
          }
        },
        required: ["id", "items"]
      }
    }
  },
  required: ["menu_language", "target_language", "sections", "warnings"]
};

const menuStructureSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, nullable: true },
    menu_language: { type: Type.STRING },
    currency: { type: Type.STRING, nullable: true },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          source_name: { type: Type.STRING, nullable: true },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                source_name: { type: Type.STRING },
                price: { type: Type.NUMBER, nullable: true },
                price_text: { type: Type.STRING, nullable: true },
                confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
                bbox_2d: {
                  type: Type.ARRAY,
                  nullable: true,
                  minItems: 4,
                  maxItems: 4,
                  items: { type: Type.NUMBER }
                },
                bbox_confidence: { type: Type.STRING, enum: ["high", "medium", "low"] }
              },
              required: ["id", "source_name", "confidence", "bbox_confidence"]
            }
          }
        },
        required: ["id", "items"]
      }
    }
  },
  required: ["menu_language", "sections"]
};

function getClient() {
  if (!env.geminiApiKey) return null;
  return new GoogleGenAI({ apiKey: env.geminiApiKey });
}

export async function parseMenuImageWithGemini(input: {
  imageBase64: string;
  mimeType: string;
  targetLanguage: string;
  countryCode?: string;
  dietaryProfile?: DietaryProfile;
  cached?: ParsedGeminiMenu | null;
}): Promise<ParsedGeminiMenu> {
  if (input.cached) return input.cached;
  const ai = getClient();
  if (!ai) return sampleParsedMenu();

  const dietaryText = input.dietaryProfile
    ? `用户忌口资料：过敏原=${input.dietaryProfile.allergies.join(",") || "无"}；宗教=${input.dietaryProfile.religion || "未填写"}；生活方式=${input.dietaryProfile.lifestyle.join(",") || "无"}；补充=${input.dietaryProfile.notes || "无"}。`
    : "用户尚未提供忌口资料。";

  const structurePrompt = [
    "你是 SeeMenu 的菜单 OCR 和版面定位引擎。请只识别菜单原文、价格、分类和 bbox，输出严格 JSON。",
    "不要翻译，不要推断食材。",
    `目标语言：${input.targetLanguage}。旅行国家或地区：${input.countryCode || "unknown"}。`,
    "请为每个菜品返回 bbox_2d，格式为 [y_min, x_min, y_max, x_max]，坐标归一化到 0-1000。bbox 覆盖菜名和价格所在行即可。",
    "如果价格或 bbox 不确定，返回 null；不要编造。"
  ].join("\n");

  const structureResult = await ai.models.generateContent({
    model: env.geminiModel,
    contents: [
      {
        role: "user",
        parts: [
          { text: structurePrompt },
          { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: menuStructureSchema
    }
  });

  const structure = JSON.parse(structureResult.text ?? "{}") as unknown;
  const enrichmentPrompt = [
    "你是 SeeMenu 的菜单翻译和忌口风险分析引擎。请基于已识别结构补全中文名、中文说明、食材推断、过敏原推断、饮食风险标签。",
    `目标语言：${input.targetLanguage}。旅行国家或地区：${input.countryCode || "unknown"}。`,
    dietaryText,
    "必须保留原文菜名、价格和 bbox，不要新增菜单结构中不存在的菜。",
    "过敏原和忌口风险只能作为 guess/risk 推断，不要说成确定事实。",
    "输出必须严格符合完整菜单 JSON schema。",
    `已识别结构：${JSON.stringify(structure)}`
  ].join("\n");

  const enrichmentResult = await ai.models.generateContent({
    model: env.geminiModel,
    contents: [{ role: "user", parts: [{ text: enrichmentPrompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: menuResponseSchema
    }
  });

  const parsed = JSON.parse(enrichmentResult.text ?? "{}") as unknown;
  return parsedGeminiMenuSchema.parse(parsed);
}

export async function generateReceiptTextWithGemini(input: {
  targetLanguage: string;
  items: Array<{ item: MenuItem; quantity: number; noteZh: string; members: string[] }>;
  members: RoomMember[];
}): Promise<{ targetLanguageText: string; chineseText: string }> {
  const chineseText = input.items
    .map(({ item, quantity, noteZh }) => `${item.sourceName} / ${item.chineseName} x${quantity}${noteZh ? `，备注：${noteZh}` : ""}`)
    .join("\n");

  const ai = getClient();
  if (!ai) {
    return {
      chineseText,
      targetLanguageText: input.items
        .map(({ item, quantity, noteZh }) => `${item.sourceName} ×${quantity}${noteZh ? `（${noteZh}）` : ""}`)
        .join("\n")
    };
  }

  const profiles = input.members.map((member) => ({
    name: member.displayName,
    allergies: member.dietaryProfile.allergies,
    religion: member.dietaryProfile.religion,
    lifestyle: member.dietaryProfile.lifestyle,
    notes: member.dietaryProfile.notes
  }));

  const result = await ai.models.generateContent({
    model: env.geminiModel,
    contents: [{
      role: "user",
      parts: [{
        text: [
          `请把以下点餐内容翻译为 ${input.targetLanguage}，生成可直接给服务员看的订单。`,
          "必须保留菜品原文名，清楚表达数量、备注、过敏原、宗教/生活方式忌口。",
          "不要添加菜单中没有的菜。输出 JSON：{ targetLanguageText, chineseText }。",
          `成员忌口资料：${JSON.stringify(profiles)}`,
          `订单：${chineseText}`
        ].join("\n")
      }]
    }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetLanguageText: { type: Type.STRING },
          chineseText: { type: Type.STRING }
        },
        required: ["targetLanguageText", "chineseText"]
      }
    }
  });

  return JSON.parse(result.text ?? "{}") as { targetLanguageText: string; chineseText: string };
}
