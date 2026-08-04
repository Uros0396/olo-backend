import type { z } from "zod";
import type { contactPayloadSchema } from "../schemas/contact.schema.js";

export type ContactPayload = z.infer<typeof contactPayloadSchema>;

export type StoredContactPayload = Omit<ContactPayload, "phone"> & {
  phone?: string;
};
