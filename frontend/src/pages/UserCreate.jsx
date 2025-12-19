import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/userService";

export default function UsersCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "commercial",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUser(formData);
      navigate("/users", { replace: true });
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects", { replace: true });
      } else {
        alert("Erreur lors de la création");
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Nouvel utilisateur</h2>
      </div>

      <div className="card form-wrapper">
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
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-primary" type="submit">
              Créer
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
  );
}
