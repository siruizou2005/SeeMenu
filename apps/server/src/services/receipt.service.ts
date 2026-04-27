import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { env } from "../env.js";
import { menus, receipts, rooms } from "../store.js";
import type { Receipt } from "../types.js";
import { generateReceiptTextWithGemini } from "./gemini.service.js";
import { saveReceipt } from "../db.js";

export async function createReceipt(roomId: string, targetLanguage?: string): Promise<Receipt> {
  const room = rooms.get(roomId);
  if (!room) throw new Error("Room not found");
  const menu = menus.get(room.menuId);
  if (!menu) throw new Error("Menu not found");

  const quantities = new Map<string, { quantity: number; noteZh: string[]; members: string[] }>();
  for (const member of room.members) {
    for (const cartItem of member.cart) {
      const current = quantities.get(cartItem.menuItemId) ?? { quantity: 0, noteZh: [], members: [] };
      current.quantity += cartItem.quantity;
      if (cartItem.noteZh) current.noteZh.push(cartItem.noteZh);
      current.members.push(member.displayName);
      quantities.set(cartItem.menuItemId, current);
    }
  }

  const lines = [...quantities.entries()]
    .map(([menuItemId, value]) => {
      const item = menu.items.find((candidate) => candidate.id === menuItemId);
      return item ? { item, quantity: value.quantity, noteZh: value.noteZh.join("；"), members: value.members } : null;
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const generated = await generateReceiptTextWithGemini({
    targetLanguage: targetLanguage ?? room.targetOrderLanguage,
    items: lines,
    members: room.members
  });

  const receipt: Receipt = {
    id: `receipt_${nanoid(10)}`,
    roomId,
    targetLanguage: targetLanguage ?? room.targetOrderLanguage,
    targetLanguageText: generated.targetLanguageText,
    chineseText: generated.chineseText,
    safetyNote: "过敏原、宗教/生活方式忌口和翻译内容请让服务员再次确认。",
    imageUrl: null,
    createdAt: new Date().toISOString()
  };
  receipts.set(receipt.id, receipt);
  saveReceipt(receipt);
  return receipt;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;"
  }[char] ?? char));
}

export async function renderReceiptImage(receiptId: string) {
  const receipt = receipts.get(receiptId);
  if (!receipt) throw new Error("Receipt not found");
  await fs.mkdir(env.receiptsDir, { recursive: true });
  const filename = `${receipt.id}.png`;
  const outputPath = path.join(env.receiptsDir, filename);
  const targetLines = receipt.targetLanguageText.split("\n").map(escapeXml);
  const chineseLines = receipt.chineseText.split("\n").map(escapeXml);

  const svg = `
  <svg width="1080" height="1440" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1440" fill="#F2F2F4"/>
    <rect x="90" y="80" width="900" height="1280" rx="36" fill="#FFFFFF"/>
    <text x="540" y="160" text-anchor="middle" font-size="56" font-weight="700" fill="#000000">SeeMenu 订单</text>
    <text x="540" y="210" text-anchor="middle" font-size="26" fill="#8E8E93">${escapeXml(receipt.createdAt.slice(0, 16).replace("T", " "))}</text>
    <line x1="130" y1="250" x2="950" y2="250" stroke="#E5E5EA" stroke-width="3" stroke-dasharray="14 12"/>
    ${targetLines.map((line, index) => `<text x="140" y="${325 + index * 50}" font-size="34" font-weight="600" fill="#000000">${line}</text>`).join("")}
    <line x1="130" y1="820" x2="950" y2="820" stroke="#E5E5EA" stroke-width="2"/>
    ${chineseLines.map((line, index) => `<text x="140" y="${885 + index * 40}" font-size="26" fill="#3C3C43">${line}</text>`).join("")}
    <rect x="130" y="1190" width="820" height="96" rx="20" fill="#FFF1EB"/>
    <text x="160" y="1248" font-size="28" fill="#FF6B35">${escapeXml(receipt.safetyNote)}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(outputPath);
  receipt.imageUrl = `/files/receipts/${filename}`;
  receipts.set(receipt.id, receipt);
  saveReceipt(receipt);
  return receipt;
}
