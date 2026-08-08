import type { StoredContactPayload } from "../dto/contact.dto.js";
import { PendingContactModel } from "../models/pending-contact.model.js";

const TOKEN_TTL_MS = 15 * 60 * 1_000;

export const contactConfirmationRepository = {
  async save(tokenHash: string, payload: StoredContactPayload): Promise<string> {
    const contact = await PendingContactModel.create({
      ...payload,
      tokenHash,
      status: "pending",
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
    });
    return contact.id as string;
  },

  async claim(tokenHash: string): Promise<(StoredContactPayload & { id: string }) | null> {
    const contact = await PendingContactModel.findOneAndUpdate(
      {
        tokenHash,
        status: "pending",
        expiresAt: { $gt: new Date() },
      },
      { $set: { status: "processing" } },
      { new: true },
    ).lean();

    if (!contact) return null;

    return {
      id: contact._id.toString(),
      name: contact.name,
      surname: contact.surname,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
    };
  },

  async release(id: string): Promise<void> {
    await PendingContactModel.updateOne(
      { _id: id, status: "processing" },
      { $set: { status: "pending" } },
    );
  },

  async delete(id: string): Promise<void> {
    await PendingContactModel.deleteOne({ _id: id });
  },
};
