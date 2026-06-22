import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, MessageSquare } from "lucide-react";
import axios from "axios";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const register = useRegister();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  async function submit() {
    setServerError("");

    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    try {
      await register.mutateAsync({
        email,
        password,
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Registration failed");
        return;
      }

      setServerError("Registration failed");
    }
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
          bg-linear-to-b
          from-zinc-900/30
          via-transparent
          to-transparent
          pointer-events-none
        "
      />

      <div className="relative w-full max-w-md">
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

        <div
          className="
            bg-[#171717]
            border
            border-zinc-800
            rounded-4xl
            p-8
            md:p-10
            shadow-2xl
          "
        >
          <h1 className="text-4xl font-bold text-white mb-2">Create account</h1>

          <p className="text-zinc-500 mb-8">
            Start chatting with your documents
          </p>

          <div className="space-y-5">
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
                  focus:border-zinc-500
                "
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

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
                  focus:border-zinc-500
                "
              />

              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3">
                <p className="text-red-500 text-sm">{serverError}</p>
              </div>
            )}

            <button
              disabled={register.isPending}
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
              {register.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-zinc-500">
              Already have an account?
              <Link
                to="/login"
                className="
                  ml-2
                  text-white
                  hover:text-zinc-300
                "
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
