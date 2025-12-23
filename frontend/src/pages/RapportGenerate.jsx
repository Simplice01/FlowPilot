import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genererRapport } from "../api/rapportService";
import Navbar from "../components/Navbar";


export default function RapportGenerate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "vente",
    date_debut: "",
    date_fin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await genererRapport(formData);
      navigate("/rapports", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error || "Erreur lors de la génération du rapport"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Générer un rapport</h2>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px 12px",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type de rapport</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="vente">Ventes</option>
              <option value="client">Clients</option>
              <option value="prospect">Prospects</option>
              <option value="activite">Activité</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date début</label>
            <input
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date fin</label>
            <input
              type="date"
              name="date_fin"
              value={formData.date_fin}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Génération..." : "Générer"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/rapports")}
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
