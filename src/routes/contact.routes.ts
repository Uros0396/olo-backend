import { Router } from "express";
import { confirmContact, requestContactConfirmation } from "../controllers/contact.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { contactPayloadSchema } from "../schemas/contact.schema.js";
import { asyncHandler } from "../utils/async-handler.js";

export const contactRouter = Router();

contactRouter.post("/", validateBody(contactPayloadSchema), asyncHandler(requestContactConfirmation));
contactRouter.get("/confirm", asyncHandler(confirmContact));
