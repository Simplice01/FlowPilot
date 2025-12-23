import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Mon profil</h2>

        <div className="profile-row">
          <strong>Nom d’utilisateur :</strong>
          <span>{user.username}</span>
        </div>

        <div className="profile-row">
          <strong>Prénom :</strong>
          <span>{user.first_name || "—"}</span>
        </div>

        <div className="profile-row">
          <strong>Nom :</strong>
          <span>{user.last_name || "—"}</span>
        </div>

        <div className="profile-row">
          <strong>Email :</strong>
          <span>{user.email || "—"}</span>
        </div>

        <div className="profile-row">
          <strong>Rôle :</strong>
          <span style={{ textTransform: "capitalize" }}>{user.role}</span>
        </div>

        <div className="profile-row">
          <strong>Téléphone :</strong>
          <span>{user.phone || "—"}</span>
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
