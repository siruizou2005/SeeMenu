import type { FastifyInstance } from "fastify";
import { nanoid } from "nanoid";
import { dietaryProfileSchema } from "../schemas/menu.schema.js";
import { findRoomByJoinCode, menus, rooms } from "../store.js";
import type { CartItem, Room, RoomMember } from "../types.js";
import { saveRoom } from "../db.js";

function roomSummary(room: Room) {
  return {
    ...room,
    totalItems: room.members.reduce((sum, member) => sum + member.cart.reduce((cartSum, item) => cartSum + item.quantity, 0), 0)
  };
}

export async function roomRoutes(app: FastifyInstance) {
  app.post("/api/rooms", async (request, reply) => {
    const body = request.body as {
      menuId: string;
      targetOrderLanguage?: string;
      hostName?: string;
      dietaryProfile?: unknown;
    };
    if (!menus.has(body.menuId)) return reply.code(404).send({ error: "menu not found" });
    const member: RoomMember = {
      id: `mem_${nanoid(8)}`,
      displayName: body.hostName || "我",
      dietaryProfile: dietaryProfileSchema.parse(body.dietaryProfile ?? {}),
      cart: [],
      ready: false,
      joinedAt: new Date().toISOString()
    };
    const room: Room = {
      id: `room_${nanoid(10)}`,
      joinCode: nanoid(4).toUpperCase(),
      menuId: body.menuId,
      targetOrderLanguage: body.targetOrderLanguage || "ja",
      members: [member],
      status: "active",
      createdAt: new Date().toISOString()
    };
    rooms.set(room.id, room);
    saveRoom(room);
    return reply.send({ room: roomSummary(room), memberId: member.id });
  });

  app.get("/api/rooms/:roomId", async (request, reply) => {
    const { roomId } = request.params as { roomId: string };
    const room = rooms.get(roomId) ?? findRoomByJoinCode(roomId);
    if (!room) return reply.code(404).send({ error: "room not found" });
    return reply.send(roomSummary(room));
  });

  app.post("/api/rooms/join", async (request, reply) => {
    const body = request.body as { joinCode: string; displayName?: string; dietaryProfile?: unknown };
    const room = findRoomByJoinCode(body.joinCode);
    if (!room) return reply.code(404).send({ error: "room not found" });
    const member: RoomMember = {
      id: `mem_${nanoid(8)}`,
      displayName: body.displayName || "朋友",
      dietaryProfile: dietaryProfileSchema.parse(body.dietaryProfile ?? {}),
      cart: [],
      ready: false,
      joinedAt: new Date().toISOString()
    };
    room.members.push(member);
    rooms.set(room.id, room);
    saveRoom(room);
    return reply.send({ room: roomSummary(room), memberId: member.id });
  });

  app.put("/api/rooms/:roomId/members/:memberId/cart", async (request, reply) => {
    const { roomId, memberId } = request.params as { roomId: string; memberId: string };
    const room = rooms.get(roomId);
    if (!room) return reply.code(404).send({ error: "room not found" });
    const body = request.body as { items: CartItem[] };
    room.members = room.members.map((member) => member.id === memberId ? { ...member, cart: body.items ?? [], ready: false } : member);
    rooms.set(room.id, room);
    saveRoom(room);
    return reply.send(roomSummary(room));
  });

  app.patch("/api/rooms/:roomId/members/:memberId/ready", async (request, reply) => {
    const { roomId, memberId } = request.params as { roomId: string; memberId: string };
    const room = rooms.get(roomId);
    if (!room) return reply.code(404).send({ error: "room not found" });
    const body = request.body as { ready?: boolean };
    room.members = room.members.map((member) => member.id === memberId ? { ...member, ready: Boolean(body.ready) } : member);
    rooms.set(room.id, room);
    saveRoom(room);
    return reply.send(roomSummary(room));
  });
}
