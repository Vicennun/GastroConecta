// src/App.jsx (versión final)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Navegacion from './components/Navegacion';
import Home from './pages/Home';
import Login from './pages/Login';

// --- Importa las nuevas páginas ---
import Buscar from './pages/Buscar';
import Registro from './pages/Registro';
import CrearReceta from './pages/CrearReceta';
import MiPerfil from './pages/MiPerfil';
import DetalleReceta from './pages/DetalleReceta';
// --- --- --- --- --- --- --- --- ---

function App() {
  return (
    <div>
      <Navegacion />
      <Container>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/buscar" element={<Buscar />} />

          {/* Rutas "Privadas" (por ahora accesibles) */}
          <Route path="/crear-receta" element={<CrearReceta />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/receta/:id" element={<DetalleReceta />} />
          {/* --- --- --- --- --- --- --- --- --- */}
        </Routes>
      </Container>
    </div>
  );
}

export default App;