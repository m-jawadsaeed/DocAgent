import { RouterProvider } from "react-router-dom";

import { router } from "./routes";

import { QueryProvider } from "./providers/query.provider";

import { ErrorBoundary } from "./components/error-boundary";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ErrorBoundary>
  );
}
