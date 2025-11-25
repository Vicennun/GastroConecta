
import React, { createContext, useState, useContext, useEffect } from 'react';
// Importamos los datos iniciales
import recetasData from '../data/recetas.json';

// --- Funciones auxiliares para localStorage ---

const usuariosData = [
  {
    "id": 1,
    "nombre": "Vicente Núñez",
    "email": "vicente@mail.com",
    "password": "123", 
    "recetario": [],
    "siguiendo": [],
    "seguidores": [],
    "rol": "admin" 
  },
  {
    "id": 2,
    "nombre": "Eduardo Chacana",
    "email": "eduardo@mail.com",
    "password": "123",
    "recetario": [],
    "siguiendo": [],
    "seguidores": [],
    "rol": "admin" 
  }
];


// Carga "usuarios" desde localStorage. Si no existe, usa los datos iniciales.
const getUsuariosDB = () => {
  const usuarios = localStorage.getItem('usuarios');
  
 
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
    // Aseguramos que las recetas iniciales tengan el campo 'ratings'
    const initialRecetasWithRatings = recetasData.map(r => ({
        ...r, 
        ratings: r.ratings || [] // Garantiza que exista el campo 'ratings'
    }));
    localStorage.setItem('recetas', JSON.stringify(initialRecetasWithRatings));
    return initialRecetasWithRatings;
  }
};

const getCurrentUserDB = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

// FUNCIÓN HELPER PARA CÁLCULO DE RATING 
const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    // Redondeamos a una cifra decimal
    return Math.round((total / ratings.length) * 10) / 10;
};
// FIN FUNCIÓN HELPER 

//  Creación del Contexto 
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor del Contexto
export const AuthProvider = ({ children, initialRecipes = null }) => {
  
  const [usuarioActual, setUsuarioActual] = useState(getCurrentUserDB); 
  const [recetas, setRecetas] = useState(() => {
  if (initialRecipes) return initialRecipes;
  const localRecetas = localStorage.getItem('recetas');
  // Aseguramos que la inicialización desde localStorage también use la estructura con 'ratings'
  if (localRecetas) {
      const parsedRecetas = JSON.parse(localRecetas);
      return parsedRecetas.map(r => ({ ...r, ratings: r.ratings || [] }));
  }
  
  // Si no hay nada, inicializamos con los datos del JSON (que deben tener 'ratings')
  const initialRecetas = recetasData.map(r => ({ ...r, ratings: r.ratings || [] }));
  localStorage.setItem('recetas', JSON.stringify(initialRecetas));
  return initialRecetas;

});
  const [usuarios, setUsuarios] = useState(getUsuariosDB);
  

  //  EFECTO PARA SINCRONIZAR ESTADOS 
  useEffect(() => {
    if (usuarioActual) {
      const usuarioActualizado = usuarios.find(u => u.id === usuarioActual.id);
      if (usuarioActualizado) {
        // Aseguramos que el usuario actual se mantenga actualizado con la data de usuarios
        setUsuarioActual(usuarioActualizado);
        localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));
      }
    }
  }, [usuarios, usuarioActual?.id]); 


  // FUNCIONES DE AUTENTICACIÓN

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
      seguidores: [],
      rol: "user" // Rol por defecto
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
    const recetaConRatings = { ...nuevaReceta, ratings: [] }; // Aseguramos que tenga ratings
    const nuevaListaRecetas = [recetaConRatings, ...recetas];
    localStorage.setItem('recetas', JSON.stringify(nuevaListaRecetas));
    setRecetas(nuevaListaRecetas);
  };

  // --- NUEVAS FUNCIONALIDADES ---

  const toggleLikeReceta = (recetaId) => {
    if (!usuarioActual) return;
    
    // Obtener la receta para la verificación de autoría
    const receta = recetas.find(r => r.id === recetaId);

    // Si el usuario actual es el autor de la receta, no puede darle "Me gusta".
    if (receta && usuarioActual.id === receta.autorId) {
        return; 
    }

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

    //  Obtener la receta
    const receta = recetas.find(r => r.id === recetaId);
    
    // Si el usuario actual es el autor de la receta, no puede guardarla.
    if (receta && usuarioActual.id === receta.autorId) {
        return; 
    }

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

  // --- FUNCIÓN DE RATING ---
  const submitRating = (recetaId, score) => {
      if (!usuarioActual) return;

      const nuevasRecetas = recetas.map(r => {
          if (r.id === recetaId) {
              // Filtrar la calificación existente del usuario, si la hay
              let ratingsActualizados = (r.ratings || []).filter(r => r.userId !== usuarioActual.id);
              // Agregar la nueva calificación
              ratingsActualizados = [...ratingsActualizados, { userId: usuarioActual.id, score }];

              return { ...r, ratings: ratingsActualizados };
          }
          return r;
      });

      setRecetas(nuevasRecetas);
      localStorage.setItem('recetas', JSON.stringify(nuevasRecetas));
  };
  // --- FIN FUNCIÓN DE RATING ---

  const confirmarReceta = (recetaId) => {
    // Si el usuario actual no es admin, no debería poder hacer esto.
    if (!usuarioActual || usuarioActual.rol !== 'admin') {
      console.error('Acceso denegado. Solo administradores pueden confirmar recetas.');
      return;
    }

    const nuevasRecetas = recetas.map(r => {
      if (r.id === recetaId) {
        return { ...r, confirmado: true };
      }
      return r;
    });

    setRecetas(nuevasRecetas);
    localStorage.setItem('recetas', JSON.stringify(nuevasRecetas));
  };
  
  const toggleSeguirUsuario = (autorId) => {
    if (!usuarioActual || usuarioActual.id === autorId) return;

    const estoySiguiendo = usuarioActual.siguiendo.includes(autorId);
    let usuarioActualizado;

    const nuevosUsuarios = usuarios.map(u => {
      // Actualizar al usuario actual (el que sigue)
      if (u.id === usuarioActual.id) {
        const siguiendoActualizado = estoySiguiendo
          ? u.siguiendo.filter(id => id !== autorId) // Dejar de seguir
          : [...u.siguiendo, autorId]; // Seguir
        
        usuarioActualizado = { ...u, siguiendo: siguiendoActualizado };
        return usuarioActualizado;
      }
      
      // Actualizar al usuario seguido (el autor)
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
    toggleSeguirUsuario,
    confirmarReceta,
    submitRating,         
    calculateAverageRating  
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
