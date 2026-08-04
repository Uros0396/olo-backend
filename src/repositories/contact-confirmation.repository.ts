import type { StoredContactPayload } from "../dto/contact.dto.js";
import { redis } from "../config/redis.js";

const TOKEN_TTL_SECONDS = 15 * 60;
const confirmationKey = (token: string) => `contact-confirmation:${token}`;

export const contactConfirmationRepository = {
  async save(token: string, payload: StoredContactPayload): Promise<void> {
    await redis.set(confirmationKey(token), JSON.stringify(payload), {
      EX: TOKEN_TTL_SECONDS,
    });
  },

  async find(token: string): Promise<StoredContactPayload | null> {
    const stored = await redis.get(confirmationKey(token));
    return stored ? JSON.parse(stored) as StoredContactPayload : null;
  },

  async delete(token: string): Promise<void> {
    await redis.del(confirmationKey(token));
  },
};
