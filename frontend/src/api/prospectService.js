import api from "./api";   // ← CETTE LIGNE MANQUAIT


export const getProspects = async () => {
  const res = await api.get("prospects/");
  return res.data;
};

export const createProspect = async (data) => {
  const res = await api.post("prospects/create/", data);
  return res.data;
};

export const convertProspect = async (id) => {
  const res = await api.post(`prospects/${id}/convert/`);
  return res.data;
};

export const updateProspect = (id, data) => {
  return api.put(`/prospects/${id}/`, data);
};

export const deleteProspect = (id) => {
  return api.delete(`/prospects/${id}/`);
};