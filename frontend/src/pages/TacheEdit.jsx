import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { updateTache } from "../api/tacheService";
import Navbar from "../components/Navbar";


export default function TacheEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const tache = state?.tache;

  useEffect(() => {
    if (!tache) {
      navigate("/taches", { replace: true });
    }
  }, [tache, navigate]);

  const [formData, setFormData] = useState({
    titre: tache?.titre || "",
    description: tache?.description || "",
    priorite: tache?.priorite || "moyenne",
    deadline: tache?.deadline || "",
    statut: tache?.statut || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateTache(id, formData);
      navigate("/taches", { replace: true });
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects", { replace: true });
      } else {
        alert("Erreur lors de la mise à jour");
      }
    }
  };

  if (!tache) return null;

  return (
    <>
      <Navbar />
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2 style={{ marginBottom: 24 }}>Modifier la tâche</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Priorité</label>
            <select
              name="priorite"
              value={formData.priorite}
              onChange={handleChange}
            >
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Statut</label>
            <input
              name="statut"
              value={formData.statut}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/taches")}
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
