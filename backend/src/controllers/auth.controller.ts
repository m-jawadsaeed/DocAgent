import { Request, Response } from "express";

import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await authService.register(email, password);

    res.status(201).json({
      success: true,
      data: user,
    });
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const tokens = await authService.login(email, password);

    res.status(200).json(tokens);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    const tokens = await authService.refresh(refreshToken);

    res.status(200).json(tokens);
  }

  async logout(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    await authService.logout(refreshToken);

    res.status(204).send();
  }
}
