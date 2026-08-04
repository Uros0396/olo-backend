import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/app-error.js";

export const validateBody = (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(new AppError(400, "Dati non validi", result.error.flatten()));
      return;
    }

    req.body = result.data;
    next();
  };
