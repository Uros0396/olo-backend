import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400 &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({
      success: false,
      message: "JSON non valido.",
    });
    return;
  }

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
