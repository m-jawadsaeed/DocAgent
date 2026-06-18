import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const navigate = useNavigate();

  const login = useLogin();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function submit() {
    await login.mutateAsync({
      email,
      password,
    });

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#171717] border border-zinc-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>

        <p className="text-zinc-400 mb-8">Sign in to continue</p>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 outline-none"
          />

          <button
            onClick={submit}
            className="w-full bg-white text-black rounded-xl p-4 font-semibold"
          >
            Sign In
          </button>

          <p className="text-center text-zinc-400">
            No account?
            <Link to="/register" className="text-white ml-2">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
