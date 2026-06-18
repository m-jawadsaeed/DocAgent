import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({
      message: "Unauthorized",
    });

    return;
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,

      email: payload.email,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
}
