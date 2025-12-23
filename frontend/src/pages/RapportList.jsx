import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRapports } from "../api/rapportService";
import Navbar from "../components/Navbar";


export default function RapportList() {
  const [rapports, setRapports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRapports();
  }, []);

  const loadRapports = async () => {
    try {
      const data = await getRapports();
      setRapports(data);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Accès refusé");
        navigate("/prospects", { replace: true });
      } else {
        alert("Erreur serveur");
      }
    }
  };

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="page-header">
        <h2>Rapports</h2>
        <Link to="/rapports/generer">
          <button className="btn btn-primary">+ Générer un rapport</button>
        </Link>
      </div>

      <div className="card table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Période</th>
              <th>Auteur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rapports.map((r) => (
              <tr key={r.id}>
                <td>{r.titre}</td>
                <td>{r.type}</td>
                <td>
                  {r.date_debut} → {r.date_fin}
                </td>
                <td>{r.auteur_username || "-"}</td>
                <td>
                  <Link to={`/rapports/${r.id}`}>
                    <button className="btn btn-secondary">Voir</button>
                  </Link>
                </td>
              </tr>
            ))}
            {rapports.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Aucun rapport disponible
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
