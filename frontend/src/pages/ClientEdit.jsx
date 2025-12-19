import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateClient } from "../api/clientService";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const client = state?.client;

  useEffect(() => {
    if (!client) navigate("/clients", { replace: true });
  }, [client, navigate]);

  const [formData, setFormData] = useState({
    first_name: client?.first_name || "",
    last_name: client?.last_name || "",
    email: client?.email || "",
    phone: client?.phone || "",
    adresse: client?.adresse || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateClient(id, formData);
    navigate("/clients", { replace: true });
  };

  if (!client) return null;

  return (
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Modifier le client</h2>

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
            <button type="submit" className="btn btn-primary">Enregistrer</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/clients")}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
