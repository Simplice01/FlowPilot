import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateContrat } from "../api/contratService";
import Navbar from "../components/Navbar";

export default function ContratEdit() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const contrat = state?.contrat;

  useEffect(() => {
    if (!contrat) navigate("/contrats");
  }, [contrat, navigate]);

  const [formData, setFormData] = useState({
    titre: contrat?.titre || "",
    statut: contrat?.statut || "",
    montant: contrat?.montant || "",
    description: contrat?.description || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateContrat(id, formData);
    navigate("/contrats");
  };

  return (
    <>
      <Navbar />
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2>Modifier contrat</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input name="titre" value={formData.titre} onChange={handleChange} />
          <input name="montant" value={formData.montant} onChange={handleChange} />
          <select name="statut" value={formData.statut} onChange={handleChange}>
            <option value="attente">En attente</option>
            <option value="signe">Signé</option>
            <option value="annule">Annulé</option>
          </select>
          <textarea name="description" value={formData.description} onChange={handleChange} />
          <button className="btn btn-primary">Enregistrer</button>
        </form>
      </div>
    </div>
    </>
  );
}
