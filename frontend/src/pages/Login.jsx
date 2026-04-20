import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      // ✅ FIXED FLOW (KEEP YOUR CODE, JUST ENSURE REDIRECT)
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;