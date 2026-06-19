import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, MessageSquare } from "lucide-react";

import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const login = useLogin();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  async function submit() {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      await login.mutateAsync({
        email,
        password,
      });

      navigate("/dashboard");
    } catch {}
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#0a0a0a]
        flex
        items-center
        justify-center
        px-4
        py-8
      "
    >
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-zinc-900/30
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      <div
        className="
          relative
          w-full
          max-w-md
        "
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div
            className="
              h-14
              w-14
              rounded-2xl
              bg-white
              text-black
              flex
              items-center
              justify-center
            "
          >
            <MessageSquare size={24} />
          </div>
        </div>

        {/* Card */}
        <div
          className="
            bg-[#171717]
            border
            border-zinc-800
            rounded-[32px]
            p-8
            md:p-10
            shadow-2xl
          "
        >
          <h1
            className="
              text-4xl
              font-bold
              text-white
              mb-2
            "
          >
            Welcome back
          </h1>

          <p className="text-zinc-500 mb-8">
            Sign in to continue chatting with DocAgent
          </p>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                type="email"
                className="
                  w-full
                  h-14
                  px-4
                  rounded-2xl
                  bg-[#222222]
                  border
                  border-zinc-700
                  text-white
                  outline-none
                  transition
                  focus:border-zinc-500
                "
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="
                  w-full
                  h-14
                  px-4
                  rounded-2xl
                  bg-[#222222]
                  border
                  border-zinc-700
                  text-white
                  outline-none
                  transition
                  focus:border-zinc-500
                "
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={login.isPending}
              onClick={submit}
              className="
                w-full
                h-14
                rounded-2xl
                bg-white
                text-black
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                hover:opacity-90
                transition
                disabled:opacity-50
              "
            >
              {login.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Footer */}
            <p className="text-center text-zinc-500">
              Don't have an account?
              <Link
                to="/register"
                className="
                  ml-2
                  text-white
                  hover:text-zinc-300
                  transition
                "
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        <p
          className="
            text-center
            text-xs
            text-zinc-600
            mt-6
          "
        >
          Secure authentication powered by DocAgent
        </p>
      </div>
    </div>
  );
}
