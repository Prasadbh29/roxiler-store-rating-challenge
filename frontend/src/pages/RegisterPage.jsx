import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { attachToken } from "../services/api";
import { useAuth } from "../auth/AuthContext";

const passwordRule = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (form.name.length < 20 || form.name.length > 60) return setError("Name must be between 20 and 60 characters.");
    if (form.address.length > 400) return setError("Address can be up to 400 characters.");
    if (!passwordRule.test(form.password)) return setError("Password must match challenge rules.");

    try {
      const { data } = await api.post("/auth/register", form);
      login({ token: data.token, user: data.user });
      attachToken(data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <input placeholder="Full Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea placeholder="Address" onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}
