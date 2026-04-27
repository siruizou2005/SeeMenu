import type { DietaryProfile, MenuItem } from "@/types/domain";

const porkWords = ["contains_pork", "pork", "猪", "豚", "叉烧"];
const beefWords = ["contains_beef", "beef", "牛"];
const meatWords = ["contains_meat", "meat", "肉", "鸡", "鶏", "豚", "牛"];

function includesAny(values: string[], words: string[]) {
  const text = values.join(" ").toLowerCase();
  return words.some((word) => text.includes(word.toLowerCase()));
}

export function getDietaryRisks(item: MenuItem, profile: DietaryProfile) {
  const values = [
    item.sourceName,
    item.chineseName,
    item.descriptionZh,
    ...item.ingredientsGuess,
    ...item.allergensGuess,
    ...item.dietaryFlags
  ];
  const risks: string[] = [];
  for (const allergy of profile.allergies) {
    if (includesAny(values, [allergy])) risks.push(`可能含${allergy}`);
  }
  for (const lifestyle of profile.lifestyle) {
    if (lifestyle.includes("不吃猪肉") && includesAny(values, porkWords)) risks.push("与你的忌口冲突：猪肉");
    if (lifestyle.includes("不吃牛肉") && includesAny(values, beefWords)) risks.push("与你的忌口冲突：牛肉");
    if ((lifestyle.includes("素食") || lifestyle.includes("纯素")) && includesAny(values, meatWords)) risks.push("可能不适合素食");
  }
  if (profile.religion?.includes("清真") && includesAny(values, porkWords)) risks.push("清真风险：可能含猪肉");
  return [...new Set(risks)];
}
