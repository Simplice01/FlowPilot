import api from "./api";

// 🔹 Liste des notifications
export const getNotifications = async () => {
  const res = await api.get("/notifications/");
  return res.data;
};

// 🔹 Marquer comme lue
export const markNotificationAsRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read/`);
  return res.data;
};

// 🔹 Supprimer une notification (manager/admin)
export const deleteNotification = async (id) => {
  await api.delete(`/notifications/${id}/delete/`);
};
