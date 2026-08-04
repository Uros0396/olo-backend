import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.details === undefined ? {} : { errors: error.details }),
    });
    return;
  }

  console.error("Errore non gestito:", error);
  res.status(500).json({
    success: false,
    message: "Errore interno del server.",
  });
};
