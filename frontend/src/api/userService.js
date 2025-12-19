import api from "./api";

// 🔒 ADMIN ONLY
export const getUsers = () => {
  return api.get("/users/").then(res => res.data);
};

export const createUser = (data) => {
  return api.post("/users/create/", data).then(res => res.data);
};

export const updateUser = (id, data) => {
  return api.put(`/users/${id}/update/`, data).then(res => res.data);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}/delete/`);
};

export const getCommerciaux = () => {
  return api.get("/users/commerciaux/").then(res => res.data);
};
