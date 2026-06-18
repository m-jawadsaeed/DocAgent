import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";

import { ConversationController } from "../controllers/conversation.controller.js";

const router = Router();

const controller = new ConversationController();

router.use(authenticate);

router.get("/", controller.list);

router.post("/", controller.create);

router.get("/:id", controller.getById);

router.get("/:id/messages", controller.messages);

router.get("/:id/memory", controller.memory);

router.patch("/:id", controller.rename);

router.patch("/:id/pin", controller.pin);

router.delete("/:id", controller.delete);

export default router;
