import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { confirmContact, requestContactConfirmation } from "../controllers/contact.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { contactPayloadSchema } from "../schemas/contact.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export const contactRouter = Router();

const contactRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Hai effettuato troppi tentativi. Riprova tra 15 minuti.",
  },
});

const contactConfirmationLimiter = rateLimit({
  windowMs: 15 * 60 * 1_000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

contactRouter.post(
  "/",
  contactRequestLimiter,
  validateBody(contactPayloadSchema),
  asyncHandler(requestContactConfirmation),
);
contactRouter.get(
  "/confirm",
  contactConfirmationLimiter,
  asyncHandler(confirmContact),
);
