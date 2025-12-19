import api from "./api";

// 📋 Liste des contrats
export const getContrats = (params = {}) => {
  return api.get("/contrats/", { params }).then(res => res.data);
};

// ➕ Création d’un contrat
export const createContrat = (data) => {
  return api.post("/contrats/create/", data).then(res => res.data);
};

// ✏️ Mise à jour d’un contrat
export const updateContrat = (id, data) => {
  return api.put(`/contrats/${id}/update/`, data).then(res => res.data);
};

// 🗑️ Suppression d’un contrat (manager/admin)
export const deleteContrat = (id) => {
  return api.delete(`/contrats/${id}/delete/`);
};

// 🔍 Détail (optionnel)
export const getContratById = (id) => {
  return api.get(`/contrats/${id}/`).then(res => res.data);
};
