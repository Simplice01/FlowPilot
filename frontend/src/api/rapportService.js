import api from "./api";

// 📋 Liste des rapports
export const getRapports = () => {
  return api.get("/rapports/").then(res => res.data);
};

// 🔍 Détail d’un rapport
export const getRapportById = (id) => {
  return api.get(`/rapports/${id}/`).then(res => res.data);
};

// ➕ Création manuelle (optionnelle)
export const createRapport = (data) => {
  return api.post("/rapports/create/", data).then(res => res.data);
};

// ⚙️ Génération automatique
export const genererRapport = (data) => {
  return api.post("/rapports/generer/", data).then(res => res.data);
};

// 🗑️ Suppression
export const deleteRapport = (id) => {
  return api.delete(`/rapports/${id}/delete/`);
};
