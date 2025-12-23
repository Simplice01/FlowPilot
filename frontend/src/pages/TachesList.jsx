import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTaches, deleteTache } from "../api/tacheService";
import Navbar from "../components/Navbar";


export default function TachesList() {
  const [taches, setTaches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadTaches();
  }, []);

  const loadTaches = async () => {
    try {
      const data = await getTaches();
      setTaches(data);
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
    if (!window.confirm("Supprimer cette tâche ?")) return;

    try {
      await deleteTache(id);
      loadTaches();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Accès refusé");
      } else {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="page-header">
        <h2>Tâches</h2>
        <Link to="/taches/new">
          <button className="btn btn-primary">+ Nouvelle tâche</button>
        </Link>
      </div>

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Commercial</th>
              <th>Priorité</th>
              <th>Deadline</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taches.map((t) => (
              <tr key={t.id}>
                <td>{t.titre}</td>
                <td>{t.commercial}</td>
                <td>{t.priorite}</td>
                <td>{t.deadline}</td>
                <td>{t.statut}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/taches/${t.id}/edit`, {
                        state: { tache: t },
                      })
                    }
                  >
                    Modifier
                  </button>

                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDelete(t.id)}
                  >
                    Supprimer
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/taches/${t.id}`)}
                  >
                    Voir
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
