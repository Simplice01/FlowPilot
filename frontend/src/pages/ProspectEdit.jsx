import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateProspect } from "../api/prospectService";
import Navbar from "../components/Navbar";


export default function ProspectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const prospect = state?.prospect;

  // Sécurité : accès direct interdit sans données
  useEffect(() => {
    if (!prospect) navigate("/prospects", { replace: true });
  }, [prospect, navigate]);

  const [formData, setFormData] = useState({
    first_name: prospect?.first_name || "",
    last_name: prospect?.last_name || "",
    email: prospect?.email || "",
    phone: prospect?.phone || "",
    source: prospect?.source || "",
  });

  useEffect(() => {
    if (prospect) {
      setFormData({
        first_name: prospect.first_name || "",
        last_name: prospect.last_name || "",
        email: prospect.email || "",
        phone: prospect.phone || "",
        source: prospect.source || "",
      });
    }
  }, [prospect]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProspect(id, formData);
      navigate("/prospects", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (!prospect) return null;

  return (
    <>
      <Navbar />
        <div className="page form-page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Modifier le prospect</h2>

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
              Enregistrer
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
    </>

  );
}
