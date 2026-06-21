import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { jwtDecode } from "jwt-decode";
import { connectSocket } from "../lib/socket";
interface ErrorResponse {
  message: string;
}

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      const decoded = jwtDecode<{
        userId: string;
        email: string;
      }>(data.accessToken);

      setAuth(
        {
          id: decoded.userId,
          email: decoded.email,
        },
        data.accessToken,
      );

      connectSocket();

      toast.success("Login successful");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message ?? "Invalid email or password");
    },
  });
}
