import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRapportById } from "../api/rapportService";

export default function RapportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rapport, setRapport] = useState(null);

  useEffect(() => {
    loadRapport();
  }, []);

  const loadRapport = async () => {
    try {
      const data = await getRapportById(id);
      setRapport(data);
    } catch (err) {
      alert("Rapport introuvable ou accès refusé");
      navigate("/rapports", { replace: true });
    }
  };

  if (!rapport) return null;

  return (
    <div className="page">
      <div className="card">
        <h2>{rapport.titre}</h2>

        <p>
          <strong>Type :</strong> {rapport.type}
        </p>
        <p>
          <strong>Période :</strong> {rapport.date_debut} →{" "}
          {rapport.date_fin}
        </p>
        <p>
          <strong>Date de création :</strong> {rapport.date_creation}
        </p>

        <hr style={{ margin: "20px 0" }} />

        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#f9fafb",
            padding: 16,
            borderRadius: 8,
          }}
        >
          {rapport.contenu}
        </pre>

        <div style={{ marginTop: 24 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/rapports")}
          >
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}
