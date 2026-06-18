import { Router } from "express";

import { ChatController } from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";
// import { requestDedup } from "../middleware/requestDedup.middleware.js";

const router = Router();

const controller = new ChatController();

// Normal ask API
router.post("/ask", authenticate, chatRateLimit, controller.ask);

// Streaming API
router.post("/stream", authenticate, chatRateLimit, controller.stream);

// Regenerate
router.post("/regenerate", authenticate, controller.regenerate);

export default router;
