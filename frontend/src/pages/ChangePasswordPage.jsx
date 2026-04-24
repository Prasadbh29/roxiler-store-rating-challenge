import { useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      const { data } = await api.put("/auth/change-password", form);
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to update password.");
    }
  }

  return (
    <Layout>
      <div className="card">
        <h2>Change Password</h2>
        <form onSubmit={submit}>
          <input type="password" placeholder="Current Password" onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          <input type="password" placeholder="New Password" onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          <button type="submit">Update</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </Layout>
  );
}
