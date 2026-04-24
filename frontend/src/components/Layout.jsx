import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Store Rating Platform</h1>
        <div className="topbar-actions">
          <span>{user?.name}</span>
          <Link to="/change-password">Change Password</Link>
          <button onClick={signOut}>Logout</button>
        </div>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
