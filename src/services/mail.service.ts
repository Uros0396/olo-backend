import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface SendMailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export const mailService = {
  async send({ to, subject, text, replyTo }: SendMailInput): Promise<void> {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      replyTo,
      subject,
      text,
    });
  },
};
