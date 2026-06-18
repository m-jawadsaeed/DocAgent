import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

export class UserController {
  profile = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  };
}
