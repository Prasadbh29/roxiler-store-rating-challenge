import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  async function load() {
    const { data } = await api.get("/stores", { params: { search } });
    setStores(data);
  }

  async function submitRating(store) {
    const value = Number(window.prompt("Rate this store (1-5):", store.myRating || 5));
    if (!value || value < 1 || value > 5) return;
    if (store.myRatingId) await api.put(`/ratings/${store.myRatingId}`, { rating: value });
    else await api.post("/ratings", { storeId: store.id, rating: value });
    load();
  }

  useEffect(() => {
    load();
  }, [search]);

  return (
    <Layout>
      <div className="filters"><input placeholder="Search store name/address" onChange={(e) => setSearch(e.target.value)} /></div>
      <section className="card">
        <h3>Available Stores</h3>
        <table><thead><tr><th>Name</th><th>Address</th><th>Overall</th><th>My Rating</th><th>Action</th></tr></thead>
          <tbody>{stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td><td>{store.address}</td><td>{store.overallRating ?? "N/A"}</td><td>{store.myRating ?? "-"}</td>
              <td><button onClick={() => submitRating(store)}>{store.myRatingId ? "Edit Rating" : "Rate"}</button></td>
            </tr>
          ))}</tbody>
        </table>
      </section>
    </Layout>
  );
}
