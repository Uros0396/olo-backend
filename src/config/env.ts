import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.string().url().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: z.string().min(1),
  BREVO_API_KEY: z.string().min(1),
  SMTP_FROM: z.string().min(1),
  SMTP_TO: z.string().email(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Variabili d'ambiente non valide:", result.error.flatten().fieldErrors);
  throw new Error("Configurazione delle variabili d'ambiente non valida.");
}

export const env = {
  ...result.data,
  APP_URL: result.data.APP_URL ?? `http://localhost:${result.data.PORT}`,
};
