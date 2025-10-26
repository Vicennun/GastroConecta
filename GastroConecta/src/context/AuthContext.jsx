// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
// Importamos los datos iniciales
import recetasData from '../data/recetas.json';

// --- Funciones auxiliares para localStorage ---

const usuariosData = [
  {
    "id": 1,
    "nombre": "Vicente Núñez",
    "email": "vicente@mail.com",
    "password": "123", // Simulamos una contraseña
    "recetario": [],
    "siguiendo": [],
    "seguidores": []
  },
  {
    "id": 2,
    "nombre": "Eduardo Chacana",
    "email": "eduardo@mail.com",
    "password": "123",
    "recetario": [],
    "siguiendo": [],
    "seguidores": []
  }
];
// --- --- --- --- --- --- --- --- --- ---

// --- Funciones auxiliares para localStorage ---

// Carga "usuarios" desde localStorage. Si no existe, usa los datos iniciales.
const getUsuariosDB = () => {
  const usuarios = localStorage.getItem('usuarios');
  
  // --- LÓGICA ACTUALIZADA ---
  if (usuarios) {
    return JSON.parse(usuarios);
  } else {
    // Si es la primera vez, guarda los usuarios base en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuariosData));
    return usuariosData;
  }
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
  
  const [usuarioActual, setUsuarioActual] = useState(getCurrentUserDB); 
  const [recetas, setRecetas] = useState(getRecetasDB);
  const [usuarios, setUsuarios] = useState(getUsuariosDB);

  // --- EFECTO PARA SINCRONIZAR ESTADOS ---
  useEffect(() => {
    if (usuarioActual) {
      const usuarioActualizado = usuarios.find(u => u.id === usuarioActual.id);
      if (usuarioActualizado) {
        setUsuarioActual(usuarioActualizado);
        localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
      }
    }
  }, [usuarios, usuarioActual?.id]); // Dependencia ajustada


  // --- FUNCIONES DE AUTENTICACIÓN ---

  const register = (nombre, email, password) => {
    const usuariosDB = getUsuariosDB(); 
    
    const existeUsuario = usuariosDB.find(u => u.email === email);
    if (existeUsuario) {
      throw new Error('El email ya está registrado');
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      password,
      recetario: [],
      siguiendo: [],
      seguidores: [] // <--- AÑADIDO
    };

    const nuevaListaUsuarios = [...usuariosDB, nuevoUsuario];
    localStorage.setItem('usuarios', JSON.stringify(nuevaListaUsuarios));
    setUsuarios(nuevaListaUsuarios);
    
    login(email, password);
  };

  const login = (email, password) => {
    const usuariosDB = getUsuariosDB();
    
    const usuarioEncontrado = usuariosDB.find(
      u => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      localStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));
      setUsuarioActual(usuarioEncontrado); 
    } else {
      throw new Error('Email o contraseña incorrectos');
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUsuarioActual(null);
  };

  // --- FUNCIONES DE RECETAS ---

  const agregarReceta = (nuevaReceta) => {
    const nuevaListaRecetas = [nuevaReceta, ...recetas];
    localStorage.setItem('recetas', JSON.stringify(nuevaListaRecetas));
    setRecetas(nuevaListaRecetas);
  };

  // --- NUEVAS FUNCIONALIDADES ---

  const toggleLikeReceta = (recetaId) => {
    if (!usuarioActual) return;

    const nuevasRecetas = recetas.map(r => {
      if (r.id === recetaId) {
        const likesActualizados = r.likes.includes(usuarioActual.id)
          ? r.likes.filter(id => id !== usuarioActual.id)
          : [...r.likes, usuarioActual.id];
        return { ...r, likes: likesActualizados };
      }
      return r;
    });

    setRecetas(nuevasRecetas);
    localStorage.setItem('recetas', JSON.stringify(nuevasRecetas));
  };

  const toggleGuardarReceta = (recetaId) => {
    if (!usuarioActual) return;

    let usuarioActualizado;
    
    const nuevosUsuarios = usuarios.map(u => {
      if (u.id === usuarioActual.id) {
        const recetarioActualizado = u.recetario.includes(recetaId)
          ? u.recetario.filter(id => id !== recetaId) 
          : [...u.recetario, recetaId]; 
        
        usuarioActualizado = { ...u, recetario: recetarioActualizado };
        return usuarioActualizado;
      }
      return u;
    });

    setUsuarios(nuevosUsuarios);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    setUsuarioActual(usuarioActualizado);
    localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
  };

  const agregarComentario = (recetaId, textoComentario) => {
    if (!usuarioActual) return;

    const nuevoComentario = {
      id: Date.now(),
      autorId: usuarioActual.id,
      autorNombre: usuarioActual.nombre,
      texto: textoComentario,
      fecha: new Date().toISOString()
    };

    const nuevasRecetas = recetas.map(r => {
      if (r.id === recetaId) {
        return { ...r, comentarios: [nuevoComentario, ...r.comentarios] };
      }
      return r;
    });

    setRecetas(nuevasRecetas);
    localStorage.setItem('recetas', JSON.stringify(nuevasRecetas));
  };

  // --- LÓGICA DE SEGUIR (ACTUALIZADA) ---
  const toggleSeguirUsuario = (autorId) => {
    if (!usuarioActual || usuarioActual.id === autorId) return;

    const estoySiguiendo = usuarioActual.siguiendo.includes(autorId);
    let usuarioActualizado;

    const nuevosUsuarios = usuarios.map(u => {
      // Caso 1: Actualizar al usuario actual (el que sigue)
      if (u.id === usuarioActual.id) {
        const siguiendoActualizado = estoySiguiendo
          ? u.siguiendo.filter(id => id !== autorId) // Dejar de seguir
          : [...u.siguiendo, autorId]; // Seguir
        
        usuarioActualizado = { ...u, siguiendo: siguiendoActualizado };
        return usuarioActualizado;
      }
      
      // Caso 2: Actualizar al usuario seguido (el autor)
      if (u.id === autorId) {
        const seguidoresActualizado = estoySiguiendo
          ? u.seguidores.filter(id => id !== usuarioActual.id) // Pierde un seguidor
          : [...(u.seguidores || []), usuarioActual.id]; // Gana un seguidor
        
        return { ...u, seguidores: seguidoresActualizado };
      }

      return u;
    });

    setUsuarios(nuevosUsuarios);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    setUsuarioActual(usuarioActualizado);
    localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
  };
  // --- FIN DE LÓGICA DE SEGUIR ---


  // --- Valor que se pasa a los componentes ---
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
