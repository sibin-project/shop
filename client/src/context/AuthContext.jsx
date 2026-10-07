import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setUnauthorizedHandler } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const clear = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clear);
    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("idle");
      return;
    }
    api
      .me()
      .then((data) => {
        setUser(data.user);
        setStatus("idle");
      })
      .catch(clear);
  }, [clear]);

  const login = useCallback(async (payload) => {
    const data = await api.login(payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.register(payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
