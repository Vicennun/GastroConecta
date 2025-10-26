// src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';

// 1. Creamos el Contexto
const AuthContext = createContext();

// 2. Creamos un "Hook" personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Creamos el Proveedor (Provider) que envolverá nuestra app
export const AuthProvider = ({ children }) => {
  // Aquí está el estado. 'null' significa "no logueado"
  const [usuarioActual, setUsuarioActual] = useState(null);

  // --- Simulación de Login ---
  // En un futuro, aquí buscaríamos en el mock data
  const login = () => {
    // Por ahora, simulamos un usuario genérico
    const usuarioSimulado = {
      id: 1,
      nombre: 'Vicente Núñez',
      email: 'vicente@duoc.cl',
    };
    setUsuarioActual(usuarioSimulado);
  };

  // --- Simulación de Logout ---
  const logout = () => {
    setUsuarioActual(null);
  };

  // Pasamos el estado y las funciones al resto de la app
  const value = {
    usuarioActual,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};