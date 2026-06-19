import { Router } from "express";

import { streamChat, regenerateChat } from "../controllers/chat.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/stream", authenticate, streamChat);

router.post("/regenerate", authenticate, regenerateChat);

export default router;
