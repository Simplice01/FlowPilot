import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTache } from "../api/tacheService";
import Navbar from "../components/Navbar";


export default function TacheDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tache, setTache] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTache();
  }, []);

  const loadTache = async () => {
    try {
      const data = await getTache(id);
      setTache(data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Accès refusé");
      } else {
        setError("Tâche introuvable");
      }
    }
  };

  if (error) {
    return (
      <div className="page">
        <div className="card">{error}</div>
      </div>
    );
  }

  if (!tache) return <p>Chargement...</p>;

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="card form-wrapper">
        <h2>Détails de la tâche</h2>

        <div className="detail-row"><strong>Titre :</strong> {tache.titre}</div>
        <div className="detail-row"><strong>Description :</strong> {tache.description || "—"}</div>
        <div className="detail-row"><strong>Commercial :</strong> {tache.commercial}</div>
        <div className="detail-row"><strong>Priorité :</strong> {tache.priorite}</div>
        <div className="detail-row"><strong>Statut :</strong> {tache.statut}</div>
        <div className="detail-row"><strong>Deadline :</strong> {tache.deadline}</div>

        <button className="btn btn-secondary" onClick={() => navigate("/taches")}>
          Retour
        </button>
      </div>
    </div>
    </>
  );
}
