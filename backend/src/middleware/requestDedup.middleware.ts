import crypto from "crypto";

import { Request, Response, NextFunction } from "express";

const activeRequests = new Set<string>();

export function requestDedup(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (activeRequests.has(hash)) {
    res.status(409).json({
      message: "Duplicate request",
    });

    return;
  }

  activeRequests.add(hash);

  res.on("finish", () => {
    activeRequests.delete(hash);
  });

  next();
}
