import type { Request, Response } from "express";
import { env } from "../config/env.js";
import type { ContactPayload } from "../dto/contact.dto.js";
import { confirmationQuerySchema } from "../schemas/contact.schema.js";
import { contactService } from "../services/contact.service.js";

export const requestContactConfirmation = async (
  req: Request<object, object, ContactPayload>,
  res: Response,
): Promise<void> => {
  await contactService.requestConfirmation(req.body);
  res.status(200).json({
    success: true,
    message: "Controlla la tua email e conferma il messaggio per inviarlo.",
  });
};

export const confirmContact = async (req: Request, res: Response): Promise<void> => {
  const query = confirmationQuerySchema.safeParse(req.query);

  if (!query.success) {
    res.redirect(303, `${env.FRONTEND_URL}/conferma?status=missing-token`);
    return;
  }

  try {
    const confirmed = await contactService.confirm(query.data.token);
    const status = confirmed ? "success" : "invalid-token";
    res.redirect(303, `${env.FRONTEND_URL}/conferma?status=${status}`);
  } catch (error) {
    console.error("Errore durante la conferma del messaggio:", error);
    res.redirect(303, `${env.FRONTEND_URL}/conferma?status=error`);
  }
};
