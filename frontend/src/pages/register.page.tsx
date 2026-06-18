import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";

export default function RegisterPage() {
  const register = useRegister();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function submit() {
    await register.mutateAsync({
      email,
      password,
    });

    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#171717] border border-zinc-800 rounded-3xl p-8">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>

        <p className="text-zinc-400 mb-8">Start using AI Document Assistant</p>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4"
          />

          <button
            onClick={submit}
            className="w-full bg-white text-black rounded-xl p-4 font-semibold"
          >
            Create Account
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
