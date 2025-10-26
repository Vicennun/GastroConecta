// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
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

  // --- Efecto para actualizar localStorage cuando el usuario cambia (para recetario/seguir) ---
  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('currentUser', JSON.stringify(usuarioActual));

      // Actualizar también la lista completa de usuarios en localStorage
      const usuariosDB = getUsuariosDB();
      const index = usuariosDB.findIndex(u => u.id === usuarioActual.id);
      if (index !== -1) {
        usuariosDB[index] = usuarioActual;
        localStorage.setItem('usuarios', JSON.stringify(usuariosDB));
        setUsuarios(usuariosDB); // Actualiza el estado de usuarios
      }
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [usuarioActual]);

  // --- Efecto para actualizar localStorage cuando las recetas cambian (likes/comentarios) ---
  useEffect(() => {
    localStorage.setItem('recetas', JSON.stringify(recetas));
  }, [recetas]);


  // --- FUNCIONES DE AUTENTICACIÓN (Tus Tareas 1 y 2) ---

  const register = (nombre, email, password) => {
    const usuariosDB = getUsuariosDB(); 
    
    const existeUsuario = usuariosDB.find(u => u.email === email);
    if (existeUsuario) {
      throw new Error('El email ya está registrado');
    }

    // 2. Crea el nuevo usuario (simulamos un ID)
    const nuevoUsuario = {
      id: Date.now(),
      nombre,
      email,
      password, // En una app real, esto debería estar encriptado
      recetario: [], // <-- NUEVO: Para recetario personal
      siguiendo: []  // <-- NUEVO: Para sistema de "seguir"
    };

    const nuevaListaUsuarios = [...usuariosDB, nuevoUsuario];
    localStorage.setItem('usuarios', JSON.stringify(nuevaListaUsuarios));
    setUsuarios(nuevaListaUsuarios); 
    
    // Inicia sesión automáticamente
    // Hacemos una copia para no mutar el estado directamente
    setUsuarioActual(JSON.parse(JSON.stringify(nuevoUsuario)));
    localStorage.setItem('currentUser', JSON.stringify(nuevoUsuario));
  };

  const login = (email, password) => {
    const usuariosDB = getUsuariosDB();
    
    const usuarioEncontrado = usuariosDB.find(
      u => u.email === email && u.password === password
    );

    if (usuarioEncontrado) {
      // --- NUEVO: Aseguramos que los campos existan ---
      const usuarioCompleto = {
        ...usuarioEncontrado,
        recetario: usuarioEncontrado.recetario || [],
        siguiendo: usuarioEncontrado.siguiendo || []
      };
      
      localStorage.setItem('currentUser', JSON.stringify(usuarioCompleto));
      setUsuarioActual(usuarioCompleto);
    } else {
      throw new Error('Email o contraseña incorrectos');
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser'); 
    setUsuarioActual(null); 
  };

  // --- FUNCIONES DE RECETAS (Tu Tarea 4) ---

  const agregarReceta = (nuevaReceta) => {
    const nuevaListaRecetas = [nuevaReceta, ...recetas];
    setRecetas(nuevaListaRecetas); 
    // El useEffect de 'recetas' se encargará de guardar en localStorage
  };

  // --- NUEVAS FUNCIONALIDADES ---

  // --- Sistema de "Me Gusta" (Like) ---
  const toggleLike = (recetaId) => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para dar 'me gusta'");
      return;
    }
    
    const userId = usuarioActual.id;
    
    setRecetas(prevRecetas => {
      return prevRecetas.map(receta => {
        if (receta.id === recetaId) {
          const likes = receta.likes || [];
          const yaDioLike = likes.includes(userId);
          
          if (yaDioLike) {
            // Quitar Like
            return { ...receta, likes: likes.filter(id => id !== userId) };
          } else {
            // Añadir Like
            return { ...receta, likes: [...likes, userId] };
          }
        }
        return receta;
      });
    });
  };

  // --- Sistema de Comentarios ---
  const agregarComentario = (recetaId, textoComentario) => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    const nuevoComentario = {
      id: Date.now(),
      autorId: usuarioActual.id,
      autorNombre: usuarioActual.nombre,
      texto: textoComentario
    };

    setRecetas(prevRecetas => {
      return prevRecetas.map(receta => {
        if (receta.id === recetaId) {
          const comentarios = receta.comentarios || [];
          return { ...receta, comentarios: [...comentarios, nuevoComentario] };
        }
        return receta;
      });
    });
  };

  // --- Sistema de Recetario Personal (Guardar Receta) ---
  const toggleGuardarReceta = (recetaId) => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para guardar recetas");
      return;
    }

    setUsuarioActual(prevUsuario => {
      const recetario = prevUsuario.recetario || [];
      const yaEstaGuardada = recetario.includes(recetaId);
      let nuevoRecetario;

      if (yaEstaGuardada) {
        nuevoRecetario = recetario.filter(id => id !== recetaId);
      } else {
        nuevoRecetario = [...recetario, recetaId];
      }
      
      // Devuelve el estado actualizado del usuario
      return { ...prevUsuario, recetario: nuevoRecetario };
    });
    // El useEffect de 'usuarioActual' se encargará de guardar en localStorage
  };

  // --- Sistema de Seguir Usuarios ---
  const toggleSeguir = (usuarioId) => {
    if (!usuarioActual) {
      alert("Debes iniciar sesión para seguir a otros usuarios");
      return;
    }
    
    if (usuarioActual.id === usuarioId) {
      alert("No puedes seguirte a ti mismo");
      return;
    }

    setUsuarioActual(prevUsuario => {
      const siguiendo = prevUsuario.siguiendo || [];
      const yaLoSigue = siguiendo.includes(usuarioId);
      let nuevoSiguiendo;

      if (yaLoSigue) {
        nuevoSiguiendo = siguiendo.filter(id => id !== usuarioId);
      } else {
        nuevoSiguiendo = [...siguiendo, usuarioId];
      }
      
      return { ...prevUsuario, siguiendo: nuevoSiguiendo };
    });
  };


  // --- Valor que se pasa a los componentes ---
  const value = {
    usuarioActual,
    recetas,        
    usuarios,       // <-- NUEVO: pasamos la lista de usuarios
    login,
    register,     
    logout,
    agregarReceta,
    toggleLike,         // <-- NUEVO
    agregarComentario,  // <-- NUEVO
    toggleGuardarReceta, // <-- NUEVO
    toggleSeguir        // <-- NUEVO
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
