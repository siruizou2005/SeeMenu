import type { Menu, Receipt, Room, Scan } from "./types.js";
import { loadPersistedEntities } from "./db.js";

export const scans = new Map<string, Scan>();
export const menus = new Map<string, Menu>();
export const rooms = new Map<string, Room>();
export const receipts = new Map<string, Receipt>();

export function hydrateStore() {
  const persisted = loadPersistedEntities();
  for (const scan of persisted.scans) scans.set(scan.id, scan);
  for (const menu of persisted.menus) menus.set(menu.id, menu);
  for (const room of persisted.rooms) rooms.set(room.id, room);
  for (const receipt of persisted.receipts) receipts.set(receipt.id, receipt);
}

export function findRoomByJoinCode(joinCode: string): Room | undefined {
  const normalized = joinCode.trim().toUpperCase();
  return [...rooms.values()].find((room) => room.joinCode === normalized);
}
