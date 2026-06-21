import { RouterProvider } from "react-router-dom";

import { router } from "./routes";

import { QueryProvider } from "./providers/query.provider";

import { ErrorBoundary } from "./components/error-boundary";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import { connectSocket } from "./lib/socket";

export default function App() {
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (token) {
      connectSocket();
    }
  }, [token]);
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  );
}
