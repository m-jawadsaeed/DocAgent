import { Router } from "express";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     responses:
 *       200:
 *         description: OK
 */

router.get(
  "/health",

  (_req, res) => {
    res.status(200).json({
      status: "ok",

      uptime: process.uptime(),

      timestamp: new Date().toISOString(),

      memory: process.memoryUsage(),
    });
  },
);

export default router;
