import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "./env.js";
import type { Menu, Receipt, Room, Scan } from "./types.js";

type EntityType = "scan" | "menu" | "room" | "receipt" | "cache";

fs.mkdirSync(env.dataDir, { recursive: true });

const db = new Database(path.join(env.dataDir, "seemenu.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS entities (
    type TEXT NOT NULL,
    id TEXT NOT NULL,
    json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (type, id)
  );
  CREATE INDEX IF NOT EXISTS entities_type_idx ON entities(type);
`);

const upsertEntity = db.prepare(`
  INSERT INTO entities(type, id, json, updated_at)
  VALUES (@type, @id, @json, @updatedAt)
  ON CONFLICT(type, id) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at
`);

const listEntities = db.prepare("SELECT json FROM entities WHERE type = ?");
const getEntityStmt = db.prepare("SELECT json FROM entities WHERE type = ? AND id = ?");
const deleteEntityStmt = db.prepare("DELETE FROM entities WHERE type = ? AND id = ?");

export function saveEntity<T>(type: EntityType, id: string, value: T) {
  upsertEntity.run({
    type,
    id,
    json: JSON.stringify(value),
    updatedAt: new Date().toISOString()
  });
}

export function listEntity<T>(type: EntityType): T[] {
  return listEntities.all(type).map((row) => JSON.parse((row as { json: string }).json) as T);
}

export function getEntity<T>(type: EntityType, id: string): T | null {
  const row = getEntityStmt.get(type, id) as { json: string } | undefined;
  return row ? JSON.parse(row.json) as T : null;
}

export function deleteEntity(type: EntityType, id: string) {
  deleteEntityStmt.run(type, id);
}

export function saveScan(scan: Scan) {
  saveEntity("scan", scan.id, scan);
}

export function saveMenu(menu: Menu) {
  saveEntity("menu", menu.id, menu);
}

export function saveRoom(room: Room) {
  saveEntity("room", room.id, room);
}

export function saveReceipt(receipt: Receipt) {
  saveEntity("receipt", receipt.id, receipt);
}

export function saveCache<T>(key: string, value: T) {
  saveEntity("cache", key, value);
}

export function getCache<T>(key: string): T | null {
  return getEntity<T>("cache", key);
}

export function loadPersistedEntities() {
  return {
    scans: listEntity<Scan>("scan"),
    menus: listEntity<Menu>("menu"),
    rooms: listEntity<Room>("room"),
    receipts: listEntity<Receipt>("receipt")
  };
}
