import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { env } from "../env.js";
import { menus, scans } from "../store.js";
import type { ParsedGeminiMenu } from "../schemas/menu.schema.js";
import type { DietaryProfile, Menu, MenuItem, Scan } from "../types.js";
import { parseMenuImageWithGemini } from "./gemini.service.js";
import { getCache, saveCache, saveMenu, saveScan } from "../db.js";
import { sampleParsedMenu } from "./sampleMenu.js";

export async function ensureDataDirs() {
  await fs.mkdir(env.uploadsDir, { recursive: true });
  await fs.mkdir(env.receiptsDir, { recursive: true });
}

export async function createMenuScan(input: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  targetLanguage: string;
  countryCode?: string;
  dietaryProfile?: DietaryProfile;
}) {
  await ensureDataDirs();
  const scanId = `scan_${nanoid(10)}`;
  const ext = path.extname(input.filename) || ".jpg";
  const imagePath = path.join(env.uploadsDir, `${scanId}${ext}`);
  const normalized = await sharp(input.buffer).rotate().resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 86 }).toBuffer();
  await fs.writeFile(imagePath, normalized);
  const metadata = await sharp(normalized).metadata();
  const imageUrl = `/files/uploads/${path.basename(imagePath)}`;
  const imageHash = crypto.createHash("sha256").update(normalized).digest("hex");

  const scan: Scan = {
    id: scanId,
    status: "processing",
    menuId: null,
    imageUrl,
    imagePath,
    imageWidth: metadata.width ?? 1,
    imageHeight: metadata.height ?? 1,
    imageHash,
    targetLanguage: input.targetLanguage,
    countryCode: input.countryCode,
    dietaryProfile: input.dietaryProfile,
    createdAt: new Date().toISOString()
  };
  scans.set(scanId, scan);
  saveScan(scan);

  void processMenuScan(scanId);
  return { scanId, status: "processing", menuId: null };
}

export async function processMenuScan(scanId: string) {
  const scan = scans.get(scanId);
  if (!scan?.imagePath) return;
  try {
    const normalized = await fs.readFile(scan.imagePath);
    const cacheKey = crypto.createHash("sha256")
      .update(JSON.stringify({
        imageHash: scan.imageHash,
        targetLanguage: scan.targetLanguage,
        countryCode: scan.countryCode,
        dietaryProfile: scan.dietaryProfile
      }))
      .digest("hex");
    const cached = getCache<ReturnType<typeof sampleParsedMenu>>(cacheKey);
    const parsed = await parseMenuImageWithGemini({
      imageBase64: normalized.toString("base64"),
      mimeType: "image/jpeg",
      targetLanguage: scan.targetLanguage ?? "zh-CN",
      countryCode: scan.countryCode,
      dietaryProfile: scan.dietaryProfile,
      cached
    });
    if (!cached) saveCache(cacheKey, parsed);
    await processParsedMenu(scan, parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown scan error";
    const nextScan = { ...scan, status: "failed" as const, errorMessage: message };
    scans.set(scanId, nextScan);
    saveScan(nextScan);
  }
}

export function resumePendingScans() {
  for (const scan of scans.values()) {
    if (scan.status === "processing") void processMenuScan(scan.id);
  }
}

export async function createDemoMenu() {
  await ensureDataDirs();
  const scanId = `scan_demo_${nanoid(8)}`;
  const imagePath = path.join(env.uploadsDir, `${scanId}.jpg`);
  const svg = `<svg width="800" height="1100" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="1100" fill="#f0e4c8"/>
    <text x="400" y="100" text-anchor="middle" font-size="54" font-weight="700">麺処 つばき</text>
    <text x="120" y="220" font-size="34">豚骨ラーメン</text><text x="620" y="220" font-size="34">¥1,180</text>
    <text x="120" y="300" font-size="34">醤油ラーメン</text><text x="620" y="300" font-size="34">¥1,080</text>
    <text x="120" y="380" font-size="34">焼き餃子</text><text x="640" y="380" font-size="34">¥580</text>
    <text x="120" y="460" font-size="34">鶏の唐揚げ</text><text x="640" y="460" font-size="34">¥780</text>
    <text x="120" y="540" font-size="34">枝豆</text><text x="640" y="540" font-size="34">¥380</text>
  </svg>`;
  const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
  await fs.writeFile(imagePath, buffer);
  const parsed = sampleParsedMenu();
  const scan: Scan = {
    id: scanId,
    status: "completed",
    menuId: null,
    imageUrl: `/files/uploads/${path.basename(imagePath)}`,
    imagePath,
    imageWidth: 800,
    imageHeight: 1100,
    createdAt: new Date().toISOString()
  };
  scans.set(scan.id, scan);
  saveScan(scan);
  await processParsedMenu(scan, parsed);
  return scans.get(scanId);
}

async function processParsedMenu(scan: Scan, parsed: ParsedGeminiMenu) {
  const menuId = `menu_${nanoid(10)}`;
  const items: MenuItem[] = parsed.sections.flatMap((section) =>
    section.items.map((item) => ({
      id: item.id || `item_${nanoid(8)}`,
      sectionId: section.id,
      sectionName: section.chinese_name ?? section.source_name,
      sourceName: item.source_name,
      chineseName: item.chinese_name,
      descriptionZh: item.description_zh,
      price: item.price,
      priceText: item.price_text,
      ingredientsGuess: item.ingredients_guess,
      allergensGuess: item.allergens_guess,
      dietaryFlags: item.dietary_flags,
      spicyLevel: item.spicy_level,
      confidence: item.confidence,
      bbox2d: item.bbox_2d,
      bboxConfidence: item.bbox_confidence
    }))
  );
  const menu: Menu = {
    id: menuId,
    scanId: scan.id,
    title: parsed.title,
    menuLanguage: parsed.menu_language,
    targetLanguage: parsed.target_language,
    currency: parsed.currency,
    imageUrl: scan.imageUrl,
    imagePath: scan.imagePath ?? "",
    imageWidth: scan.imageWidth ?? 1,
    imageHeight: scan.imageHeight ?? 1,
    items,
    warnings: parsed.warnings,
    createdAt: new Date().toISOString()
  };
  menus.set(menuId, menu);
  saveMenu(menu);
  const nextScan = { ...scan, status: "completed" as const, menuId };
  scans.set(scan.id, nextScan);
  saveScan(nextScan);
}
