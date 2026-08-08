import { env } from "../config/env.js";

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

const parseSender = (value: string): { name?: string; email: string } => {
  const match = value.match(/^\s*(.*?)\s*<([^<>]+)>\s*$/);

  if (match) {
    return { name: match[1].trim() || undefined, email: match[2].trim() };
  }

  return { email: value.trim() };
};

export const mailService = {
  async send({ to, subject, text, replyTo }: SendMailInput): Promise<void> {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: parseSender(env.SMTP_FROM),
        to: [{ email: to }],
        replyTo: replyTo ? { email: replyTo } : undefined,
        subject,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Brevo API ${response.status}: ${details}`);
    }
  },
};
