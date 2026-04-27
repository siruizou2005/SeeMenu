import type { Receipt } from "@/types/domain";
import { apiGet, apiJson } from "./client";

export function createReceipt(roomId: string, targetLanguage = "ja") {
  return apiJson<Receipt>(`/api/rooms/${roomId}/receipt`, { targetLanguage });
}

export function getReceipt(receiptId: string) {
  return apiGet<Receipt>(`/api/receipts/${receiptId}`);
}

export function renderReceiptImage(receiptId: string) {
  return apiJson<Receipt>(`/api/receipts/${receiptId}/image`, {});
}
