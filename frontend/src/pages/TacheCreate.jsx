import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTache } from "../api/tacheService";
import { getCommerciaux } from "../api/userService";
import Navbar from "../components/Navbar";


export default function TacheCreate() {
  const navigate = useNavigate();
  const [commerciaux, setCommerciaux] = useState([]);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    priorite: "moyenne",
    deadline: "",
    statut: "a faire",
    commercial: "",
  });

  useEffect(() => {
    loadCommerciaux();
  }, []);

  const loadCommerciaux = async () => {
    try {
      const data = await getCommerciaux();
      setCommerciaux(data);
    } catch (err) {
      alert("Erreur lors du chargement des commerciaux");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTache(formData);
      navigate("/taches", { replace: true });
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Veuillez sélectionner un commercial.");
      } else if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects", { replace: true });
      } else {
        alert("Erreur lors de la création");
      }
    }
  };

  return (
    <>
      <Navbar />
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2>Nouvelle tâche</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input name="titre" value={formData.titre} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Commercial</label>
            <select
              name="commercial"
              value={formData.commercial}
              onChange={handleChange}
              required
            >
              <option value="">-- Choisir un commercial --</option>
              {commerciaux.map(c => (
                <option key={c.id} value={c.id}>
                  {c.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Priorité</label>
            <select name="priorite" value={formData.priorite} onChange={handleChange}>
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Statut</label>
            <input name="statut" value={formData.statut} onChange={handleChange} />
          </div>

          <button className="btn btn-primary" type="submit">Créer</button>
        </form>
      </div>
    </div>
    </>
  );
}
          