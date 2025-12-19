import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "../api/clientService";

export default function ClientCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    adresse: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createClient(formData);
    navigate("/clients", { replace: true });
  };

  return (
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Nouveau client</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Prénom</label>
            <input name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input name="adresse" value={formData.adresse} onChange={handleChange} />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button type="submit" className="btn btn-primary">Créer</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/clients")}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
