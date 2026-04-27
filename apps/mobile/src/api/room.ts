import type { CartItem, DietaryProfile, Room } from "@/types/domain";
import { apiGet, apiJson } from "./client";

export function createRoom(input: {
  menuId: string;
  hostName: string;
  dietaryProfile: DietaryProfile;
  targetOrderLanguage?: string;
}) {
  return apiJson<{ room: Room; memberId: string }>("/api/rooms", input);
}

export function joinRoom(input: {
  joinCode: string;
  displayName: string;
  dietaryProfile: DietaryProfile;
}) {
  return apiJson<{ room: Room; memberId: string }>("/api/rooms/join", input);
}

export function getRoom(roomId: string) {
  return apiGet<Room>(`/api/rooms/${roomId}`);
}

export function updateCart(roomId: string, memberId: string, items: CartItem[]) {
  return apiJson<Room>(`/api/rooms/${roomId}/members/${memberId}/cart`, { items }, "PUT");
}

export function setMemberReady(roomId: string, memberId: string, ready: boolean) {
  return apiJson<Room>(`/api/rooms/${roomId}/members/${memberId}/ready`, { ready }, "PATCH");
}
