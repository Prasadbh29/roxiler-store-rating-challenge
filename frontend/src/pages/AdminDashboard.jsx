import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [userForm, setUserForm] = useState({ name: "", email: "", address: "", password: "", role: "USER" });
  const [storeForm, setStoreForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  async function loadData() {
    const [a, b, c] = await Promise.all([
      api.get("/admin/dashboard/stats"),
      api.get("/admin/users", { params: { search, role } }),
      api.get("/admin/stores", { params: { search } }),
    ]);
    setStats(a.data);
    setUsers(b.data);
    setStores(c.data);
  }

  useEffect(() => {
    loadData();
  }, [search, role]);

  async function createUser(event) {
    event.preventDefault();
    await api.post("/admin/users", { ...userForm });
    setUserForm({ name: "", email: "", address: "", password: "", role: "USER" });
    loadData();
  }

  async function createStore(event) {
    event.preventDefault();
    await api.post("/admin/stores", { ...storeForm, ownerId: storeForm.ownerId ? Number(storeForm.ownerId) : undefined });
    setStoreForm({ name: "", email: "", address: "", ownerId: "" });
    loadData();
  }

  async function openUser(id) {
    const { data } = await api.get(`/admin/users/${id}`);
    setSelectedUser(data);
  }

  return (
    <Layout>
      <div className="grid">
        <div className="card">Users: {stats?.totalUsers ?? "-"}</div>
        <div className="card">Stores: {stats?.totalStores ?? "-"}</div>
        <div className="card">Ratings: {stats?.totalRatings ?? "-"}</div>
      </div>
      <div className="filters">
        <input placeholder="Search name, email, address" onChange={(e) => setSearch(e.target.value)} />
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="OWNER">Owner</option>
        </select>
      </div>
      <div className="grid">
        <section className="card">
          <h3>Add User</h3>
          <form onSubmit={createUser}>
            <input placeholder="Name" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            <input placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            <textarea placeholder="Address" value={userForm.address} onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} />
            <input placeholder="Password" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="ADMIN">Admin</option><option value="USER">User</option><option value="OWNER">Owner</option>
            </select>
            <button type="submit">Create User</button>
          </form>
        </section>
        <section className="card">
          <h3>Add Store</h3>
          <form onSubmit={createStore}>
            <input placeholder="Store Name" value={storeForm.name} onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })} />
            <input placeholder="Store Email" value={storeForm.email} onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })} />
            <textarea placeholder="Address" value={storeForm.address} onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })} />
            <input placeholder="Owner ID (optional)" value={storeForm.ownerId} onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })} />
            <button type="submit">Create Store</button>
          </form>
        </section>
      </div>
      <section className="card">
        <h3>Users</h3>
        <table><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>{users.map((u) => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td><td><button onClick={() => openUser(u.id)}>View</button></td></tr>)}</tbody>
        </table>
      </section>
      <section className="card">
        <h3>Stores</h3>
        <table><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Avg Rating</th></tr></thead>
          <tbody>{stores.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{s.averageRating ?? "N/A"}</td></tr>)}</tbody>
        </table>
      </section>
      {selectedUser && (
        <section className="card">
          <h3>User Details</h3>
          <p><strong>Name:</strong> {selectedUser.name}</p>
          <p><strong>Email:</strong> {selectedUser.email}</p>
          <p><strong>Address:</strong> {selectedUser.address}</p>
          <p><strong>Role:</strong> {selectedUser.role}</p>
          {selectedUser.role === "OWNER" && <p><strong>Store Rating:</strong> {selectedUser.ownerStoreRating ?? "N/A"}</p>}
        </section>
      )}
    </Layout>
  );
}
