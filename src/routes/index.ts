import { Router } from "express";
import { contactRouter } from "./contact.routes.js";
import { healthRouter } from "./health.routes.js";

export const router = Router();
router.use("/health", healthRouter);
router.use("/api/contact", contactRouter);
