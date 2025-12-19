import api from "./api";

export const login = async (credentials) => {
  const res = await api.post("token/", credentials);
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/users/me/");
  return res.data;
};
