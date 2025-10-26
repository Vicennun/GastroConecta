// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa tus componentes (asegúrate que las rutas sean correctas)
import Navegacion from './components/Navegacion';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CrearReceta from './pages/CrearReceta';
import DetalleReceta from './pages/DetalleReceta';
import MiPerfil from './pages/MiPerfil';
import Buscar from './pages/Buscar'; // Página placeholder
import Footer from './components/Footer'; // Revisa si tu archivo se llama Footer.jsx o footer.jsx

function App() {
  return (
    <>
      <Navegacion />

      {/* CLAVE: Este div es flex-grow-1 (ocupa espacio) Y d-flex flex-column (es contenedor flex) */}
      <div className="flex-grow-1 d-flex flex-column">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/crear-receta" element={<CrearReceta />} />
          <Route path="/receta/:id" element={<DetalleReceta />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/buscar" element={<Buscar />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;