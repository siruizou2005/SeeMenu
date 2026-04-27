import type { FastifyInstance } from "fastify";
import { receipts } from "../store.js";
import { createReceipt, renderReceiptImage } from "../services/receipt.service.js";

export async function receiptRoutes(app: FastifyInstance) {
  app.post("/api/rooms/:roomId/receipt", async (request, reply) => {
    const { roomId } = request.params as { roomId: string };
    const body = request.body as { targetLanguage?: string };
    try {
      const receipt = await createReceipt(roomId, body.targetLanguage);
      return reply.send(receipt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "receipt failed";
      return reply.code(400).send({ error: message });
    }
  });

  app.get("/api/receipts/:receiptId", async (request, reply) => {
    const { receiptId } = request.params as { receiptId: string };
    const receipt = receipts.get(receiptId);
    if (!receipt) return reply.code(404).send({ error: "receipt not found" });
    return reply.send(receipt);
  });

  app.post("/api/receipts/:receiptId/image", async (request, reply) => {
    const { receiptId } = request.params as { receiptId: string };
    try {
      const receipt = await renderReceiptImage(receiptId);
      return reply.send(receipt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "image export failed";
      return reply.code(400).send({ error: message });
    }
  });
}
