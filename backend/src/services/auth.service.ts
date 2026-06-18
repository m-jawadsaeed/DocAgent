import { UserRepository } from "../repositories/auth.repository.js";
import { RefreshTokenRepository } from "../repositories/refreshToken.repository.js";
import { AuditLogRepository } from "../repositories/auditLog.repository.js";

import { hashPassword, comparePassword } from "../utils/passwoed.js";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { ApiError } from "../utils/ApiError.js";

export class AuthService {
  private readonly users = new UserRepository();

  private readonly refreshTokens = new RefreshTokenRepository();

  private readonly auditLogs = new AuditLogRepository();

  async register(email: string, password: string) {
    const existing = await this.users.findByEmail(email);

    if (existing) {
      throw new ApiError(409, "User already exists");
    }

    const passwordHash = await hashPassword(password);

    const user = await this.users.create(email, passwordHash);

    await this.auditLogs.create(user.id, "REGISTER", {
      email,
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    await this.refreshTokens.create(
      refreshToken,
      user.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    await this.auditLogs.create(user.id, "LOGIN", {});

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const existing = await this.refreshTokens.find(refreshToken);

    if (!existing) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const payload = verifyRefreshToken(refreshToken);

    await this.refreshTokens.delete(refreshToken);

    const accessToken = signAccessToken(payload);

    const newRefreshToken = signRefreshToken(payload);

    await this.refreshTokens.create(
      newRefreshToken,
      payload.userId,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string) {
    await this.refreshTokens.delete(refreshToken);
  }
}
