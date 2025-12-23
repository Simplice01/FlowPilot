import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateVente } from "../api/venteService";
import Navbar from "../components/Navbar";


export default function VenteEdit() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const vente = state?.vente;

  useEffect(() => {
    if (!vente) navigate("/ventes");
  }, [vente, navigate]);

  const [formData, setFormData] = useState({
    montant: vente?.montant || "",
    statut: vente?.statut || "impaye",
    date_vente: vente?.date_vente || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateVente(id, formData);
    navigate("/ventes");
  };

  return (
    <>
      <Navbar />
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2>Modifier vente</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input name="montant" value={formData.montant} onChange={handleChange} />
          <input type="date" name="date_vente" value={formData.date_vente} onChange={handleChange} />
          <select name="statut" value={formData.statut} onChange={handleChange}>
            <option value="impaye">Impayé</option>
            <option value="paye">Payé</option>
          </select>
          <button className="btn btn-primary">Enregistrer</button>
        </form>
      </div>
    </div>
    </>
  );
}
