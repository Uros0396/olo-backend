import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error-handler.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(router);
app.use(errorHandler);
