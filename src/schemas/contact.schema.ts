import { z } from "zod";

export const contactPayloadSchema = z.object({
  name: z.string().trim().min(2, "Il nome è obbligatorio").max(80),
  surname: z.string().trim().min(2, "Il cognome è obbligatorio").max(80),
  email: z.string().trim().email("Inserisci un indirizzo email valido"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Il messaggio deve avere almeno 10 caratteri")
    .max(2000),
});

export const confirmationQuerySchema = z.object({
  token: z.string().uuid(),
});
