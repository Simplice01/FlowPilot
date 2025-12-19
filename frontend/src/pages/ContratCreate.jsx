import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContrat } from "../api/contratService";
import { getClients } from "../api/clientService";
import { getCommerciaux } from "../api/userService";

export default function ContratCreate() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [commerciaux, setCommerciaux] = useState([]);

  const [formData, setFormData] = useState({
    titre: "",
    client: "",
    commercial: "",
    montant: "",
    statut: "attente",
    description: "",
    date_signature: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setClients(await getClients());
      setCommerciaux(await getCommerciaux());
    } catch (err) {
      alert("Erreur chargement données");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createContrat(formData);
      navigate("/contrats", { replace: true });
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Veuillez remplir tous les champs obligatoires");
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
        <h2>Nouveau contrat</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input name="titre" placeholder="Titre" onChange={handleChange} required />

          <select name="client" onChange={handleChange} required>
            <option value="">-- Client --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nom || c.id}</option>
            ))}
          </select>

          <select name="commercial" onChange={handleChange} required>
            <option value="">-- Commercial --</option>
            {commerciaux.map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>

          <input name="montant" type="number" onChange={handleChange} required />
          <input type="date" name="date_signature" onChange={handleChange} />

          <select name="statut" onChange={handleChange}>
            <option value="attente">En attente</option>
            <option value="signe">Signé</option>
            <option value="annule">Annulé</option>
          </select>

          <textarea name="description" onChange={handleChange} />

          <button className="btn btn-primary">Créer</button>
        </form>
      </div>
    </div>
  );
}
