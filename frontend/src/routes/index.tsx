import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/login.page";
import RegisterPage from "../pages/register.page";
import ChatPage from "../pages/chat.page";

import { ProtectedRoute } from "./protected.route";

export const router = createBrowserRouter([
  {
    path: "/",

    element: <Navigate to="/chat" replace />,
  },

  {
    path: "/login",

    element: <LoginPage />,
  },

  {
    path: "/register",

    element: <RegisterPage />,
  },

  {
    path: "/chat",

    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "*",

    element: <Navigate to="/chat" replace />,
  },
]);
