import React, { createContext, useState, useContext, useEffect } from 'react';

// CAMBIA ESTO POR TU IP DE AWS
const API_URL = import.meta.env.VITE_API_URL || "http://54.87.102.198:8080/api/v1";

const getCurrentUserDB = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// HELPER: Calcular promedio (Para los ratings)
const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    return Math.round((total / ratings.length) * 10) / 10;
};

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  
  const [usuarioActual, setUsuarioActual] = useState(getCurrentUserDB); 
  const [recetas, setRecetas] = useState([]); 
  const [usuarios, setUsuarios] = useState([]); 

  useEffect(() => {
    cargarRecetas();
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('currentUser', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [usuarioActual]);

  // --- CARGA DE DATOS ---
  const cargarRecetas = async () => {
    try {
      const res = await fetch(`${API_URL}/recetas`);
      if (res.ok) {
        const data = await res.json();
        
        // TRANSFORMACIÓN MÁGICA: Convertir strings del backend a objetos para el frontend
        const recetasFormateadas = data.map(receta => {
            let ingredientesObjetos = [];
            
            // Si el backend trae 'ingredientesSimples', los convertimos
            if (receta.ingredientesSimples && receta.ingredientesSimples.length > 0) {
                ingredientesObjetos = receta.ingredientesSimples.map(texto => {
                    // Separamos por el guión " - " que usamos al guardar
                    const partes = texto.split(' - ');
                    return { 
                        nombre: partes[0] || texto, 
                        cantidad: partes[1] || '' 
                    };
                });
            }
            
            // Devolvemos la receta con el campo 'ingredientes' lleno
            return { ...receta, ingredientes: ingredientesObjetos };
        });

        setRecetas(recetasFormateadas);
      }
    } catch (error) { console.error(error); }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${API_URL}/users`); 
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) { console.error(error); }
  };

  // --- AUTH ---
  const register = async (nombre, email, password) => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nombre, email, password, rol: 'user' })
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
    localStorage.removeItem('currentUser');
  };

  // --- ACCIONES RECETAS ---
  const agregarReceta = async (nuevaReceta) => {
    // Convertimos ingredientes de objetos a lista simple de strings para el backend
    const recetaBackend = {
        ...nuevaReceta,
        ingredientesSimples: nuevaReceta.ingredientes.map(i => `${i.nombre} - ${i.cantidad}`)
    };

    const response = await fetch(`${API_URL}/recetas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recetaBackend)
    });
    
    if (response.ok) {
        const creada = await response.json();
        // Reconstruimos ingredientes para el frontend localmente
        creada.ingredientes = creada.ingredientesSimples.map(s => {
            const [n, c] = s.split(' - ');
            return { nombre: n, cantidad: c || '' };
        });
        setRecetas([creada, ...recetas]);
    } else {
        throw new Error("Error al guardar en servidor");
    }
  };

  const toggleLikeReceta = async (recetaId) => {
    if (!usuarioActual) return;
    const res = await fetch(`${API_URL}/recetas/${recetaId}/like?userId=${usuarioActual.id}`, { method: 'POST' });
    if(res.ok) {
        const actualizada = await res.json();
        actualizarRecetaLocal(actualizada);
    }
  };

  const agregarComentario = async (recetaId, texto) => {
    if (!usuarioActual) return;
    const comentario = { autorId: usuarioActual.id, autorNombre: usuarioActual.name, texto };
    const res = await fetch(`${API_URL}/recetas/${recetaId}/comentar`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(comentario)
    });
    if(res.ok) {
        const actualizada = await res.json();
        actualizarRecetaLocal(actualizada);
    }
  };

  // --- NUEVAS FUNCIONES (Rating, Confirmar, Seguir, Guardar) ---

  const submitRating = async (recetaId, score) => {
    if (!usuarioActual) return;
    const rating = { userId: usuarioActual.id, score };
    const res = await fetch(`${API_URL}/recetas/${recetaId}/rate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rating)
    });
    if(res.ok) {
        const actualizada = await res.json();
        actualizarRecetaLocal(actualizada);
    }
  };

  const confirmarReceta = async (recetaId) => {
    if (!usuarioActual || usuarioActual.rol !== 'admin') return;
    const res = await fetch(`${API_URL}/recetas/${recetaId}/confirmar`, { method: 'PUT' });
    if(res.ok) {
        const actualizada = await res.json();
        actualizarRecetaLocal(actualizada);
    }
  };

  const toggleGuardarReceta = async (recetaId) => {
    if (!usuarioActual) return;
    const res = await fetch(`${API_URL}/users/${usuarioActual.id}/guardar/${recetaId}`, { method: 'POST' });
    if (res.ok) {
      const userUpdate = await res.json();
      setUsuarioActual(userUpdate);
    }
  };

  const toggleSeguirUsuario = async (targetId) => {
    if (!usuarioActual) return;
    const res = await fetch(`${API_URL}/users/${usuarioActual.id}/seguir/${targetId}`, { method: 'POST' });
    if (res.ok) {
      const userUpdate = await res.json();
      setUsuarioActual(userUpdate);
      cargarUsuarios(); // Recargamos para ver cambios en seguidores del otro
    }
  };

  // Helper para actualizar estado local sin recargar todo
  const actualizarRecetaLocal = (recetaActualizada) => {
     // Formateamos ingredientes de vuelta
     if(recetaActualizada.ingredientesSimples) {
         recetaActualizada.ingredientes = recetaActualizada.ingredientesSimples.map(s => {
            const [n, c] = s.split(' - ');
            return { nombre: n, cantidad: c || '' };
        });
     }
     setRecetas(prev => prev.map(r => r.id === recetaActualizada.id ? recetaActualizada : r));
  };

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
    toggleSeguirUsuario,
    confirmarReceta,
    submitRating,
    calculateAverageRating
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};