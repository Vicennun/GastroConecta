// src/context/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';
// Importamos los datos iniciales
import recetasData from '../data/recetas.json';

// --- Funciones auxiliares para localStorage ---

// Carga "usuarios" desde localStorage. Si no existe, devuelve [].
const getUsuariosDB = () => {
  const usuarios = localStorage.getItem('usuarios');
  return usuarios ? JSON.parse(usuarios) : [];
};

// Carga "recetas" desde localStorage. Si no existe, usa las del JSON.
const getRecetasDB = () => {
  const recetas = localStorage.getItem('recetas');
  if (recetas) {
    return JSON.parse(recetas);
  } else {
    // Si es la primera vez, guarda las recetas base en localStorage
    localStorage.setItem('recetas', JSON.stringify(recetasData));
    return recetasData;
  }
};

// Carga el usuario "logueado" desde localStorage.
const getCurrentUserDB = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// --- Creación del Contexto ---
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// --- Proveedor del Contexto ---
export const AuthProvider = ({ children }) => {
  
  // --- ESTADOS GLOBALES ---
  const [usuarioActual, setUsuarioActual] = useState(getCurrentUserDB); // Usuario logueado
  const [recetas, setRecetas] = useState(getRecetasDB);                 // Lista de recetas
  const [usuarios, setUsuarios] = useState(getUsuariosDB);               // Lista de usuarios

  // --- FUNCIONES DE AUTENTICACIÓN (Tus Tareas 1 y 2) ---

  const register = (nombre, email, password) => {
    const usuariosDB = getUsuariosDB(); // Obtiene la lista fresca
    
    // 1. Revisa si el email ya existe
    const existeUsuario = usuariosDB.find(u => u.email === email);
    if (existeUsuario) {
      throw new Error('El email ya está registrado');
    }

    // 2. Crea el nuevo usuario (simulamos un ID)
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      password // En una app real, esto debería estar encriptado
    };

    // 3. Guarda la nueva lista de usuarios en localStorage
    const nuevaListaUsuarios = [...usuariosDB, nuevoUsuario];
    localStorage.setItem('usuarios', JSON.stringify(nuevaListaUsuarios));
    setUsuarios(nuevaListaUsuarios); // Actualiza el estado
    
    // 4. Inicia sesión automáticamente
    login(email, password);
  };

  const login = (email, password) => {
    const usuariosDB = getUsuariosDB();
    
    // 1. Busca al usuario
    const usuarioEncontrado = usuariosDB.find(
      u => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      // 2. Guarda el usuario logueado en localStorage para persistir la sesión
      localStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));
      setUsuarioActual(usuarioEncontrado); // Actualiza el estado
    } else {
      throw new Error('Email o contraseña incorrectos');
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser'); // Borra la sesión
    setUsuarioActual(null); // Actualiza el estado
  };

  // --- FUNCIONES DE RECETAS (Tu Tarea 4) ---

  const agregarReceta = (nuevaReceta) => {
    // 1. Añade la nueva receta al principio de la lista
    const nuevaListaRecetas = [nuevaReceta, ...recetas];
    
    // 2. Guarda la lista actualizada en localStorage
    localStorage.setItem('recetas', JSON.stringify(nuevaListaRecetas));
    setRecetas(nuevaListaRecetas); // Actualiza el estado
  };


  // --- Valor que se pasa a los componentes ---
  const value = {
    usuarioActual,
    recetas,        // <--- Nuevo
    login,
    register,     // <--- Nuevo
    logout,
    agregarReceta,  // <--- Nuevo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};