import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getVentes, deleteVente } from "../api/venteService";

export default function VentesList() {
  const [ventes, setVentes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadVentes();
  }, []);

  const loadVentes = async () => {
    try {
      const data = await getVentes();
      setVentes(data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects", { replace: true });
      } else {
        alert("Erreur serveur");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette vente ?")) return;
    try {
      await deleteVente(id);
      loadVentes();
    } catch {
      alert("Suppression impossible");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Ventes</h2>
        <Link to="/ventes/new">
          <button className="btn btn-primary">+ Nouvelle vente</button>
        </Link>
      </div>

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Contrat</th>
              <th>Commercial</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map(v => (
              <tr key={v.id}>
                <td>{v.contrat}</td>
                <td>{v.commercial}</td>
                <td>{v.montant} FCFA</td>
                <td>{v.statut}</td>
                <td>{v.date_vente}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/ventes/${v.id}/edit`, { state: { vente: v } })
                    }
                  >
                    Modifier
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(v.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {ventes.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Aucune vente
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
