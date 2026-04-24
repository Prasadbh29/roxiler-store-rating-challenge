import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function OwnerDashboard() {
  const [data, setData] = useState({ averageRating: null, ratings: [] });

  useEffect(() => {
    api.get("/owner/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <Layout>
      <div className="grid"><div className="card">Average Rating: {data.averageRating ?? "N/A"}</div></div>
      <section className="card">
        <h3>Users who rated your store</h3>
        <table><thead><tr><th>Name</th><th>Email</th><th>Rating</th><th>Date</th></tr></thead>
          <tbody>{data.ratings.map((r) => (
            <tr key={r.id}><td>{r.userName}</td><td>{r.email}</td><td>{r.rating}</td><td>{new Date(r.createdAt).toLocaleDateString()}</td></tr>
          ))}</tbody>
        </table>
      </section>
    </Layout>
  );
}
