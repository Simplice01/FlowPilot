import api from "./api";

// 📋 Liste des ventes
export const getVentes = (params = {}) => {
  return api.get("/ventes/", { params }).then(res => res.data);
};

// ➕ Création d’une vente
export const createVente = (data) => {
  return api.post("/ventes/create/", data).then(res => res.data);
};

// ✏️ Mise à jour
export const updateVente = (id, data) => {
  return api.put(`/ventes/${id}/update/`, data).then(res => res.data);
};

// 🗑️ Suppression (manager/admin)
export const deleteVente = (id) => {
  return api.delete(`/ventes/${id}/delete/`);
};

// 🔍 Détail (optionnel)
export const getVenteById = (id) => {
  return api.get(`/ventes/${id}/`).then(res => res.data);
};
