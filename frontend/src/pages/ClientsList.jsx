import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getClients, deleteClient } from "../api/clientService";
import { useAuth } from "../auth/AuthContext";

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth(); // suppose que user contient role

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await getClients();
    setClients(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    await deleteClient(id);
    loadClients();
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Clients</h2>
        <Link to="/clients/new">
          <button className="btn btn-primary">+ Nouveau client</button>
        </Link>
      </div>

      <div className="card table-wrapper">
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
            {clients.map((c) => (
              <tr key={c.id}>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <span className={`status ${c.statut}`}>
                    {c.statut}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(`/clients/${c.id}/edit`, {
                        state: { client: c },
                      })
                    }
                  >
                    Modifier
                  </button>

                  {user?.role !== "commercial" && (
                    <button
                      className="btn btn-danger"
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDelete(c.id)}
                    >
                      Supprimer
                    </button>
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
