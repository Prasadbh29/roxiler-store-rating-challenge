import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export function attachToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/* Auto restore token on startup */
const saved = localStorage.getItem("store-rating-auth");

if (saved) {
  const parsed = JSON.parse(saved);
  if (parsed?.token) {
    attachToken(parsed.token);
  }
}

export default api;