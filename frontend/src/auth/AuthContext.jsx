import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api"; // ⚠️ même instance Axios avec interceptor

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Chargement initial (reload page)
  useEffect(() => {
    const storedToken = localStorage.getItem("access");

    if (storedToken) {
      setToken(storedToken);

      // 🔥 Charger l'utilisateur connecté
      api
        .get("/users/me/")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          // Token invalide / expiré
          localStorage.clear();
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // 🔐 Login
  const login = async (access, refresh) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setToken(access);

    // 🔥 Charger user immédiatement après login
    const res = await api.get("/users/me/");
    setUser(res.data);
  };

  // 🔓 Logout
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,              // 🔥 MAINTENANT DISPONIBLE
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
