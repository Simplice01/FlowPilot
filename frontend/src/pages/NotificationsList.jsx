import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../api/notificationService";
import Navbar from "../components/Navbar";


export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      alert("Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    await markNotificationAsRead(id);
    loadNotifications();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette notification ?")) return;
    await deleteNotification(id);
    loadNotifications();
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <Navbar />
    <div className="page">
      <div className="page-header">
        <h2>Notifications</h2>
      </div>

      <div className="card table-wrapper">
        {notifications.length === 0 ? (
          <p>Aucune notification</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Message</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td>{n.message}</td>
                  <td>{n.is_read ? "Lue" : "Non lue"}</td>
                  <td>{new Date(n.created_at).toLocaleString()}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    {!n.is_read && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleRead(n.id)}
                      >
                        Marquer comme lue
                      </button>
                    )}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(n.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </>
  );
}
