// src/components/Navegacion.jsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap'; // Añade Button
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext'; // --- 1. Importa el Hook ---

export default function Navegacion() {
  
  // --- 2. Usa el contexto ---
  const { usuarioActual, logout } = useAuth();
  // 'usuarioActual' será un objeto (si está logueado) o 'null' (si no)

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="mb-4">
      <Container>
        
        <LinkContainer to="/">
          <Navbar.Brand>GastroConecta</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="me-auto">
            {/* ... (links de Inicio y Buscar quedan igual) ... */}
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/buscar">
              <Nav.Link>Buscar</Nav.Link>
            </LinkContainer>
          </Nav>

          <Nav>
            {/* --- 3. Comprueba 'usuarioActual' en lugar de 'usuarioLogueado' --- */}
            {usuarioActual ? ( 
              // --- Si está logueado ---
              <>
                <LinkContainer to="/crear-receta">
                  <Nav.Link>Crear Receta</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/mi-perfil">
                  <Nav.Link>Hola, {usuarioActual.nombre}</Nav.Link>
                </LinkContainer>
                
                {/* --- 4. Botón de Logout --- */}
                <Button variant="outline-secondary" onClick={logout} className="ms-2">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // --- Si es visitante ---
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Iniciar Sesión</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/registro">
                  <Nav.Link>Registro</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}