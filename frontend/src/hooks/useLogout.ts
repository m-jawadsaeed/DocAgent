import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";

interface ErrorResponse {
  message: string;
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.register,

    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success("Account created successfully");
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data.message ?? "Registration failed");
    },
  });
}
