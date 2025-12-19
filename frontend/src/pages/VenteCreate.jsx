import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVente } from "../api/venteService";
import { getContrats } from "../api/contratService";
import { getCommerciaux } from "../api/userService";

export default function VenteCreate() {
  const navigate = useNavigate();
  const [contrats, setContrats] = useState([]);
  const [commerciaux, setCommerciaux] = useState([]);

  const [formData, setFormData] = useState({
    contrat: "",
    commercial: "",
    montant: "",
    statut: "impaye",
    date_vente: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setContrats(await getContrats());
      setCommerciaux(await getCommerciaux());
    } catch {
      alert("Erreur chargement données");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVente(formData);
      navigate("/ventes", { replace: true });
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Veuillez remplir tous les champs requis");
      } else if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects");
      } else {
        alert("Erreur lors de la création");
      }
    }
  };

  return (
    <div className="page form-page">
      <div className="card form-wrapper">
        <h2>Nouvelle vente</h2>

        <form className="form" onSubmit={handleSubmit}>
          <select name="contrat" onChange={handleChange} required>
            <option value="">-- Contrat --</option>
            {contrats.map(c => (
              <option key={c.id} value={c.id}>{c.titre || c.id}</option>
            ))}
          </select>

          <select name="commercial" onChange={handleChange} required>
            <option value="">-- Commercial --</option>
            {commerciaux.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>

          <input name="montant" type="number" onChange={handleChange} required />
          <input type="date" name="date_vente" onChange={handleChange} required />

          <select name="statut" onChange={handleChange}>
            <option value="impaye">Impayé</option>
            <option value="paye">Payé</option>
          </select>

          <button className="btn btn-primary">Créer</button>
        </form>
      </div>
    </div>
  );
}
