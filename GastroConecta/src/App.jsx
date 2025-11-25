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
import Buscar from './pages/Buscar'; 
import Footer from './components/Footer';
import PerfilUsuario from './pages/PerfilUsuario';
import AdminPage from './pages/AdminPage'; 

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
          <Route path="/perfil/:id" element={<PerfilUsuario />} /> 
          <Route path="/buscar" element={<Buscar />} />
          <Route path="/admin" element={<AdminPage />} /> {/* <-- 2. AÑADIR NUEVA RUTA */}
        </Routes>
      </div>

      <Footer />
    </>
  );
}

export default App;
