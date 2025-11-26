// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// URL BASE (Asegúrate de tener tu .env o cambiar la IP aquí)
const API_URL = import.meta.env.VITE_API_URL || "http://34.229.20.25:8080/api/v1";

const getCurrentUserDB = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
  const [usuarioActual, setUsuarioActual] = useState(getCurrentUserDB); 
  const [recetas, setRecetas] = useState([]); // Inicializamos vacío, se llenará con la API
  const [usuarios, setUsuarios] = useState([]); // Opcional si implementas GET users

  // --- EFECTO: Cargar Recetas al iniciar ---
  useEffect(() => {
    cargarRecetas();
    cargarUsuarios();
  }, []);

  // --- EFECTO: Persistir sesión ---
  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('currentUser', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [usuarioActual]);

  // --- FUNCIONES API ---

  const cargarRecetas = async () => {
    try {
      const res = await fetch(`${API_URL}/recetas`);
      if (res.ok) {
        const data = await res.json();
        setRecetas(data);
      }
    } catch (error) {
      console.error("Error cargando recetas:", error);
    }
  };

  const register = async (nombre, email, password) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombre, email, password })
    });
    if (!response.ok) throw new Error('Error al registrar');
    const nuevoUsuario = await response.json();
    setUsuarioActual(nuevoUsuario);
  };

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    const usuarioEncontrado = await response.json();
    setUsuarioActual(usuarioEncontrado);
  };

  const logout = () => {
    setUsuarioActual(null);
  };

  // --- FUNCIONES RECETAS (CONECTADAS A LA API) ---

  const agregarReceta = async (nuevaReceta) => {
    // Adaptamos los ingredientes para el backend simplificado (String)
    const recetaParaEnviar = {
        // NO pongas 'id' aquí. ¡Bórralo si está!
        titulo: nuevaReceta.titulo,
        descripcion: nuevaReceta.descripcion,
        tiempoPreparacion: nuevaReceta.tiempoPreparacion,
        autorId: nuevaReceta.autorId,
        autorNombre: nuevaReceta.autorNombre,
        foto: nuevaReceta.foto,
        confirmado: true, 
        pasos: nuevaReceta.pasos,
        etiquetasDieteticas: nuevaReceta.etiquetasDieteticas,
        ingredientesSimples: nuevaReceta.ingredientes.map(i => `${i.nombre} - ${i.cantidad}`)
    };

    try {
      const response = await fetch(`${API_URL}/recetas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recetaParaEnviar)
      });
      
      if (response.ok) {
        const recetaCreada = await response.json();
        // Transformamos de vuelta ingredientesSimples a objetos para el frontend
        recetaCreada.ingredientes = recetaCreada.ingredientesSimples.map(s => {
            const [nombre, cantidad] = s.split(' - ');
            return { nombre, cantidad: cantidad || '' };
        });
        setRecetas([recetaCreada, ...recetas]);
        return true; // Éxito
      }
    } catch (error) {
      console.error("Error al crear receta:", error);
      throw error;
    }
  };

  const toggleLikeReceta = async (recetaId) => {
    if (!usuarioActual) return;
    try {
        // Llamada al backend para dar like
        const res = await fetch(`${API_URL}/recetas/${recetaId}/like?userId=${usuarioActual.id}`, {
            method: 'POST'
        });
        if(res.ok) {
            // Actualizamos localmente recargando o modificando el estado
            const recetaActualizada = await res.json();
            // Mapeo simple de actualización
            setRecetas(prev => prev.map(r => r.id === recetaId ? recetaActualizada : r));
        }
    } catch (error) {
        console.error("Error like:", error);
    }
  };

  // (Opcional) Funciones pendientes de backend real
  const toggleGuardarReceta = (id) => console.log("Falta endpoint guardar");
  const agregarComentario = (id, txt) => console.log("Falta endpoint comentario");
  const toggleSeguirUsuario = (id) => console.log("Falta endpoint seguir");

  const value = {
    usuarioActual,
    recetas,
    usuarios,
    login,
    register,
    logout,
    agregarReceta,
    toggleLikeReceta,
    toggleGuardarReceta,
    agregarComentario,
    toggleSeguirUsuario
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/users`); // Ojo: es /users, no /recetas
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};