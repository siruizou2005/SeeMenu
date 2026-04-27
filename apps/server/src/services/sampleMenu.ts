import type { ParsedGeminiMenu } from "../schemas/menu.schema.js";

export function sampleParsedMenu(): ParsedGeminiMenu {
  return {
    title: "麺処 つばき",
    menu_language: "ja",
    target_language: "zh-CN",
    currency: "JPY",
    warnings: ["当前使用本地样例数据。设置 GEMINI_API_KEY 后会调用 Gemini。"],
    sections: [
      {
        id: "sec_ramen",
        source_name: "ラーメン",
        chinese_name: "拉面",
        items: [
          {
            id: "tonkotsu",
            source_name: "豚骨ラーメン",
            chinese_name: "豚骨拉面",
            description_zh: "猪骨白汤拉面，口味浓郁，通常含猪肉、小麦面和葱。",
            price: 1180,
            price_text: "¥1,180",
            ingredients_guess: ["猪骨汤", "猪肉", "小麦面", "葱"],
            allergens_guess: ["小麦", "大豆"],
            dietary_flags: ["contains_pork", "contains_gluten"],
            spicy_level: 0,
            confidence: "high",
            bbox_2d: [180, 120, 225, 850],
            bbox_confidence: "high"
          },
          {
            id: "shoyu",
            source_name: "醤油ラーメン",
            chinese_name: "酱油拉面",
            description_zh: "酱油汤底拉面，咸鲜清爽，可能含小麦、大豆和鸡骨汤。",
            price: 1080,
            price_text: "¥1,080",
            ingredients_guess: ["酱油", "小麦面", "鸡汤"],
            allergens_guess: ["小麦", "大豆"],
            dietary_flags: ["contains_gluten"],
            spicy_level: 0,
            confidence: "high",
            bbox_2d: [240, 120, 285, 850],
            bbox_confidence: "high"
          }
        ]
      },
      {
        id: "sec_side",
        source_name: "おつまみ",
        chinese_name: "小菜",
        items: [
          {
            id: "gyoza",
            source_name: "焼き餃子",
            chinese_name: "煎饺",
            description_zh: "日式煎饺，常见猪肉白菜馅，外皮含小麦。",
            price: 580,
            price_text: "¥580",
            ingredients_guess: ["猪肉", "白菜", "小麦皮"],
            allergens_guess: ["小麦", "大豆"],
            dietary_flags: ["contains_pork", "contains_gluten"],
            spicy_level: 0,
            confidence: "high",
            bbox_2d: [360, 120, 405, 850],
            bbox_confidence: "high"
          },
          {
            id: "karaage",
            source_name: "鶏の唐揚げ",
            chinese_name: "日式炸鸡块",
            description_zh: "腌制鸡腿肉裹粉油炸，通常配柠檬。",
            price: 780,
            price_text: "¥780",
            ingredients_guess: ["鸡肉", "小麦粉", "酱油"],
            allergens_guess: ["小麦", "大豆"],
            dietary_flags: ["contains_meat", "fried"],
            spicy_level: 0,
            confidence: "high",
            bbox_2d: [420, 120, 465, 850],
            bbox_confidence: "high"
          },
          {
            id: "edamame",
            source_name: "枝豆",
            chinese_name: "盐煮毛豆",
            description_zh: "盐水煮带壳毛豆，适合作为下酒小菜。",
            price: 380,
            price_text: "¥380",
            ingredients_guess: ["毛豆", "盐"],
            allergens_guess: ["大豆"],
            dietary_flags: ["vegetarian"],
            spicy_level: 0,
            confidence: "high",
            bbox_2d: [480, 120, 525, 850],
            bbox_confidence: "high"
          }
        ]
      }
    ]
  };
}
