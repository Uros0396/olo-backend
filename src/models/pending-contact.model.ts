import { Schema, model } from "mongoose";

export type PendingContactStatus = "pending" | "processing";

export type PendingContact = {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  message: string;
  tokenHash: string;
  status: PendingContactStatus;
  expiresAt: Date;
};

const pendingContactSchema = new Schema<PendingContact>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    surname: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, maxlength: 30 },
    message: { type: String, required: true, trim: true, maxlength: 2_000 },
    tokenHash: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "processing"],
      default: "pending",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  {
    collection: "pending_contacts",
    timestamps: true,
    versionKey: false,
  },
);

pendingContactSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PendingContactModel = model<PendingContact>(
  "PendingContact",
  pendingContactSchema,
);
