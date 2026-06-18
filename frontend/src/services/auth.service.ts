import { api } from "../api/client";

import type{
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "../types/auth.types";

export class AuthService {
  public async login(payload: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", payload);

    return response.data;
  }

  public async register(payload: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", payload);

    return response.data;
  }

  public async refreshToken(): Promise<{
    accessToken: string;
  }> {
    const response = await api.post("/auth/refresh");

    return response.data;
  }

  public async logout(): Promise<void> {
    await api.post("/auth/logout");
  }
}

export const authService = new AuthService();
