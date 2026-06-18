import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const register = useRegister();
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

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    try {
      await register.mutateAsync({
        email,
        password,
      });

      navigate("/dashboard");
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#171717] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>

        <p className="text-zinc-400 mb-8">Start using AI Document Assistant</p>

        <div className="space-y-5">
          <div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-white"
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
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none focus:border-white"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          <button
            disabled={register.isPending}
            onClick={submit}
            className="w-full bg-white text-black rounded-xl p-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {register.isPending ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-zinc-400">
            Already registered?
            <Link to="/login" className="text-white ml-2">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
