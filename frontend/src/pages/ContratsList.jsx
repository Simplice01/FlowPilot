import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getContrats, deleteContrat } from "../api/contratService";
import Navbar from "../components/Navbar";


export default function ContratsList() {
  const [contrats, setContrats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadContrats();
  }, []);

  const loadContrats = async () => {
    try {
      const data = await getContrats();
      setContrats(data);
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
    if (!window.confirm("Supprimer ce contrat ?")) return;

    try {
      await deleteContrat(id);
      loadContrats();
    } catch (err) {
      alert("Suppression impossible");
    }
  };

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="page-header">
        <h2>Contrats</h2>
        <Link to="/contrats/new">
          <button className="btn btn-primary">+ Nouveau contrat</button>
        </Link>
      </div>

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Client</th>
              <th>Commercial</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contrats.map(c => (
              <tr key={c.id}>
                <td>{c.titre}</td>
                <td>{c.client}</td>
                <td>{c.commercial}</td>
                <td>{c.montant} FCFA</td>
                <td>{c.statut}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/contrats/${c.id}/edit`, {
                        state: { contrat: c },
                      })
                    }
                  >
                    Modifier
                  </button>

                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(c.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

            {contrats.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Aucun contrat
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
