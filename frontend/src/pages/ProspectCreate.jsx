import { useState } from "react";
import { createProspect } from "../api/prospectService";
import { useNavigate } from "react-router-dom";

export default function ProspectCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    source: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProspect(formData);
      navigate("/prospects", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création");
    }
  };

  return (
      <div className="page form-page">
    <div className="card form-wrapper">
      <h2 style={{ marginBottom: 24 }}>Nouveau prospect</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Prénom</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Nom</label>
          <input
            name="last_name"
            value={formData.last_name}
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
          <label>Téléphone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Source</label>
          <input
            name="source"
            value={formData.source}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button type="submit" className="btn btn-primary">
            Créer
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/prospects")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>

  );
}
