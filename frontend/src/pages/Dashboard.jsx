import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    key: "prospects",
    label: "Prospects",
    path: "/prospects",
    roles: ["commercial", "manager", "admin"],
  },
  {
    key: "clients",
    label: "Clients",
    path: "/clients",
    roles: ["commercial", "manager", "admin"],
  },
  {
    key: "taches",
    label: "Tâches",
    path: "/taches",
    roles: ["commercial", "manager", "admin"],
  },
  {
    key: "ventes",
    label: "Ventes",
    path: "/ventes",
    roles: ["commercial", "manager", "admin"],
  },
  {
    key: "contrats",
    label: "Contrats",
    path: "/contrats",
    roles: ["manager", "admin"],
  },
  {
    key: "rapports",
    label: "Rapports",
    path: "/rapports",
    roles: ["manager", "admin"],
  },
  {
    key: "utilisateurs",
    label: "Utilisateurs",
    path: "/users",
    roles: ["admin"],
  },
  {
    key: "notifications",
    label: "Notifications",
    path: "/notifications",
    roles: ["commercial", "manager", "admin"],
  },

  {
  key: "profile",
  label: "Mon profil",
  path: "/profile",
  roles: ["commercial", "manager", "admin"],
 },

];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 🔥 nettoie tokens + état
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Dashboard</h2>
          <p style={{ color: "var(--muted)" }}>
            Bienvenue {user.first_name || user.username}
          </p>
        </div>
        {/* PROFIL */}
        <button
        className="btn btn-secondary"
        onClick={() => navigate("/profile")}
      >
        Mon profil
      </button>

        {/* 🔒 DÉCONNEXION */}
        <button className="btn btn-danger" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

      <div className="dashboard-grid">
        {modules
          .filter((m) => m.roles.includes(user.role))
          .map((m) => (
            <div
              key={m.key}
              className="dashboard-card"
              onClick={() => navigate(m.path)}
            >
              <h3>{m.label}</h3>
              <p>Accéder au module {m.label.toLowerCase()}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
