import { Request, Response } from "express";

import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";

export function errorHandler(error: Error, req: Request, res: Response): void {
  logger.error({
    message: error.message,
    path: req.originalUrl,
    method: req.method,
  });

  if (res.headersSent) {
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
  });
}
