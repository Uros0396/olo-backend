import type { Request, Response } from "express";

export const getHealth = (_req: Request, res: Response): void => {
  res.json({ ok: true, message: "Backend attivo" });
};
