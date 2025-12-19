import api from "./api";

// 📋 Liste des tâches
export const getTaches = () => {
  return api.get("/taches/").then(res => res.data);
};

// ➕ Création d’une tâche
export const createTache = (data) => {
  return api.post("/taches/create/", data).then(res => res.data);
};

// ✏️ Mise à jour d’une tâche
export const updateTache = (id, data) => {
  return api.put(`/taches/${id}/update/`, data).then(res => res.data);
};

// 🗑️ Suppression d’une tâche (manager/admin)
export const deleteTache = (id) => {
  return api.delete(`/taches/${id}/delete/`);
};

export const getTache = (id) => {
  return api.get(`/taches/${id}/`).then(res => res.data);
};
