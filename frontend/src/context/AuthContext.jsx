import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario guardado y token válido
    const checkAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");

      if (savedUser && token) {
        try {
          // Verificar que el token aún sea válido
          const response = await api.get("/auth/me");
          setUser(response.data.data);
        } catch (error) {
          console.error("Token inválido:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (alias, contraseña) => {
    try {
      const response = await api.post("/auth/login", {
        alias,
        contraseña,
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const register = async (nombre, alias, email, contraseña) => {
    try {
      const response = await api.post("/auth/register", {
        nombre,
        alias,
        email: email || null, // Si está vacío, enviar null en lugar de string vacío
        contraseña,
      });

      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar usuario",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
