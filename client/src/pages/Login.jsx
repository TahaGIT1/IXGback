import { useState } from "react";
import api from "../api/axios";
import { Navigate } from "react-router-dom";

export default function Login() {
    const isAdmin = localStorage.getItem("isAdmin");
  const [password, setPassword] = useState("");

  if (isAdmin) {
  return <Navigate to="/admin" replace />;
}



 const handleLogin = async (e) => {
  e.preventDefault();

 
try {
  const res = await api.post(
    "/api/auth/login",
    { password }
  );

  localStorage.setItem("token", res.data.token);

  window.location.href = "/admin";

} catch (error) {
  console.error(error.response?.data || error);

  alert("Invalid Password");
}
};

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        

       <div className="mb-6 text-center">

  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
    🔒
  </div>

  <h1 className="text-3xl font-bold text-gray-900">
    IXG Admin Portal
  </h1>

  <p className="mt-2 text-gray-500">
    Enter your admin password to manage runs and registrations.
  </p>

</div>
        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
  type="button"
  onClick={() => window.location.href = "/"}
  className="mt-3 w-full rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
>
  ← Back to IXG Run Club
</button>
        </form>

      </div>
    </section>
  );
}