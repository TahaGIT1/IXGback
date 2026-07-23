import { useState } from "react";
import api from "../api/axios";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const token = localStorage.getItem("token");
  const [password, setPassword] = useState("");

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
  e.preventDefault();
  console.log("Button clicked");

  try {
    const res = await api.post("/api/auth/login", {
      password,
    });

    console.log(res.data);

    localStorage.setItem("token", res.data.token);

    toast.success("Login successful!");

    setTimeout(() => {
      window.location.href = "/admin";
    }, 800);
  } catch (error) {
    console.log("Login failed");
    console.log(error);

    toast.error("Invalid password");
  }
};

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-800">
            🔒
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            IXG Admin Portal
          </h1>

          <p className="mt-2 text-gray-500">
            Enter your admin password to manage runs and registrations.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3 focus:border-blue-800 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-800 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            ← Back to IXG Run Club
          </button>
        </form>
      </div>
    </section>
  );
}