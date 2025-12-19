import api from "./api";

// 📋 Liste des clients
export const getClients = (params = {}) => {
  return api.get("/clients/", { params }).then(res => res.data);
};

// ➕ Création d’un client
export const createClient = (data) => {
  return api.post("/clients/create/", data).then(res => res.data);
};

// ✏️ Mise à jour
export const updateClient = (id, data) => {
  return api.put(`/clients/${id}/update/`, data).then(res => res.data);
};

// 🗑️ Suppression
export const deleteClient = (id) => {
  return api.delete(`/clients/${id}/delete/`);
};
