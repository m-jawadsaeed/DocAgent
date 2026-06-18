import type{ ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.accessToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
