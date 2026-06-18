import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

const controller = new UserController();

router.get("/profile", authenticate, controller.profile);

export default router;
