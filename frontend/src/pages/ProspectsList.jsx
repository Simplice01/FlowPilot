import { useEffect, useState } from "react";
import { getProspects, convertProspect } from "../api/prospectService";
import { Link, useNavigate } from "react-router-dom";

export default function ProspectsList() {
  const [prospects, setProspects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    const data = await getProspects();
    setProspects(data);
  };

  const handleConvert = async (id) => {
    const confirm = window.confirm(
      "Convertir ce prospect en client ? Cette action est irréversible."
    );

    if (!confirm) return;

    try {
      await convertProspect(id);
      await loadProspects();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la conversion");
    }
  };

  return (
    <div className="page">
  <div className="page-header">
    <h2>Prospects</h2>
    <Link to="/prospects/new">
      <button className="btn btn-primary">+ Nouveau prospect</button>
    </Link>
  </div>

  <div className="card">
    <table className="table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {prospects.map((p) => (
          <tr key={p.id}>
            <td>{p.first_name} {p.last_name}</td>
            <td>{p.email}</td>
            <td>{p.phone}</td>
            <td>
              <span className={`status ${p.statut}`}>
                {p.statut}
              </span>
            </td>
            <td>
              {p.statut !== "converti" && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleConvert(p.id)}
                  >
                    Convertir
                  </button>{" "}
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/prospects/${p.id}/edit`)}
                  >
                    Modifier
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

  );
}
