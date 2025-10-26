// src/App.jsx (VERSIÓN FINAL CORRECTA)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Navegacion from './components/Navegacion';
import Home from './pages/Home';
import Login from './pages/Login';
import Buscar from './pages/Buscar';
import Registro from './pages/Registro';
import CrearReceta from './pages/CrearReceta';
import MiPerfil from './pages/MiPerfil';
import DetalleReceta from './pages/DetalleReceta';
import Footer from './components/footer';

function App() {
  return (
    // --- 1. Usa un <div> o <> aquí, NO un <Container> ---
    <>
      {/* --- 2. El Navbar va primero, sin márgenes --- */}
      <Navegacion />
      
      {/* --- 3. El Container envuelve SOLO las rutas --- */}
      <Container className="mt-4 flex-grow-1"> {/* Le añadimos un margen superior */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/receta/:id" element={<DetalleReceta />} />

          {/* Rutas "Privadas" */}
          <Route path="/crear-receta" element={<CrearReceta />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
        </Routes>
      </Container>

      <Footer /> {/* 3. AÑADIR FOOTER AL FINAL */}
    </>
  );
}

export default App;