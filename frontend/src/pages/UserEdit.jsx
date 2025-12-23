import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateUser } from "../api/userService";
import Navbar from "../components/Navbar";


export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const user = state?.user;

  // 🔒 Accès direct interdit (pas de GET by ID)
  useEffect(() => {
    if (!user) {
      navigate("/users", { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "commercial",
    phone: user?.phone || "",
    password: "", // optionnel
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔥 Ne pas envoyer le password s’il est vide
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      await updateUser(id, payload);
      navigate("/users", { replace: true });
    } catch (err) {
      console.error(err);

      if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects", { replace: true });
      } else {
        setError("Erreur lors de la mise à jour de l’utilisateur");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Modifier l’utilisateur</h2>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom d’utilisateur</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="commercial">Commercial</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Nouveau mot de passe (optionnel)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Laisser vide pour ne pas modifier"
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/users")}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
