import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVenteById } from "../api/venteService";
import Navbar from "../components/Navbar";


export default function VenteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vente, setVente] = useState(null);

  useEffect(() => {
    loadVente();
  }, []);

  const loadVente = async () => {
    try {
      setVente(await getVenteById(id));
    } catch {
      alert("Vente introuvable");
      navigate("/ventes");
    }
  };

  if (!vente) return null;

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="card">
        <h2>Détail de la vente</h2>
        <p><strong>Contrat :</strong> {vente.contrat}</p>
        <p><strong>Commercial :</strong> {vente.commercial}</p>
        <p><strong>Montant :</strong> {vente.montant} FCFA</p>
        <p><strong>Statut :</strong> {vente.statut}</p>
        <p><strong>Date :</strong> {vente.date_vente}</p>

        <button className="btn btn-secondary" onClick={() => navigate("/ventes")}>
          Retour
        </button>
      </div>
    </div>
    </>
  );
}
