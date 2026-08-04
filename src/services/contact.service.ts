import crypto from "node:crypto";
import { env } from "../config/env.js";
import type { ContactPayload, StoredContactPayload } from "../dto/contact.dto.js";
import { contactConfirmationRepository } from "../repositories/contact-confirmation.repository.js";
import { mailService } from "./mail.service.js";

export const contactService = {
  async requestConfirmation(payload: ContactPayload): Promise<void> {
    const token = crypto.randomUUID();
    const storedPayload: StoredContactPayload = {
      ...payload,
      phone: payload.phone || undefined,
    };

    await contactConfirmationRepository.save(token, storedPayload);

    await mailService.send({
      to: payload.email,
      replyTo: payload.email,
      subject: "Conferma il tuo messaggio - passo 1/2",
      text: [
        "Ciao,",
        "Per inviare il tuo messaggio conferma il tuo indirizzo email cliccando il link qui sotto:",
        `${env.APP_URL}/api/contact/confirm?token=${token}`,
        "",
        "Se non hai richiesto questo contatto, ignora questa email.",
      ].join("\n"),
    });
  },

  async confirm(token: string): Promise<boolean> {
    const payload = await contactConfirmationRepository.find(token);
    if (!payload) return false;

    await mailService.send({
      to: env.SMTP_TO,
      replyTo: payload.email,
      subject: `Nuovo messaggio dal form contatti: ${payload.name} ${payload.surname}`,
      text: [
        `Nome: ${payload.name}`,
        `Cognome: ${payload.surname}`,
        `Email: ${payload.email}`,
        `Telefono: ${payload.phone || "Non inserito"}`,
        "",
        "Messaggio:",
        payload.message,
      ].join("\n"),
    });

    await contactConfirmationRepository.delete(token);
    return true;
  },
};
