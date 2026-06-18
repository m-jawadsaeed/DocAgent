import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import documentRoutes from "../routes/document.routes.js"
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";

import conversationRoutes from "./conversation.routes.js";
import userRoutes from "./user.routes.js";
const router = Router();

router.use("/users", userRoutes);

router.use("/conversations", conversationRoutes);
router.use("/health", healthRoutes);

router.use("/auth", authRoutes);
router.use("/documents", documentRoutes);
router.post("/ask", chatRateLimit);
export default router;
