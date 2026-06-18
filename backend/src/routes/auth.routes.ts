import { Router } from "express";

import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

const controller = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary:
 *       User Login
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description:
 *           Login Successful
 */

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/refresh", controller.refresh);

router.post("/logout", controller.logout);

export default router;
