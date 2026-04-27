import type { DietaryProfile, Menu, Scan } from "@/types/domain";
import { API_BASE_URL, apiGet } from "./client";

export async function uploadMenuScan(input: {
  uri: string;
  dietaryProfile: DietaryProfile;
  targetLanguage?: string;
  countryCode?: string;
}) {
  const form = new FormData();
  form.append("image", {
    uri: input.uri,
    name: "menu.jpg",
    type: "image/jpeg"
  } as unknown as Blob);
  form.append("targetLanguage", input.targetLanguage ?? "zh-CN");
  form.append("countryCode", input.countryCode ?? "JP");
  form.append("dietaryProfile", JSON.stringify(input.dietaryProfile));

  const response = await fetch(`${API_BASE_URL}/api/menu/scans`, {
    method: "POST",
    body: form
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<{ scanId: string; status: Scan["status"]; menuId: string | null; errorMessage?: string }>;
}

export function getScan(scanId: string) {
  return apiGet<Scan>(`/api/menu/scans/${scanId}`);
}

export function getMenu(menuId: string) {
  return apiGet<Menu>(`/api/menus/${menuId}`);
}

export async function createDemoMenu() {
  const response = await fetch(`${API_BASE_URL}/api/demo/menu`, { method: "POST" });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<Scan>;
}
