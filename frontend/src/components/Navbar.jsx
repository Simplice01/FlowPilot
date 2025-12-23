import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <strong>FlowPilot</strong>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          {user.first_name || user.username} ({user.role})
        </span>

        <button className="btn btn-secondary" onClick={() => navigate("/profile")}>
          Profil
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button
          className="btn btn-danger"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
