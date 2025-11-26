// src/components/Navegacion.jsx

import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Navegacion() {
  
  const { usuarioActual, logout } = useAuth();

  return (
    // 'mb-4' añade un margen abajo
    <Navbar expand="lg" bg="dark" variant="dark">
      
      {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
      <Container fluid> 
        
        <LinkContainer to="/">
          <Navbar.Brand>GastroConecta</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            
          </Nav>

          <Nav>
            {usuarioActual ? ( 
              <>
                <LinkContainer to="/crear-receta">
                  <Nav.Link>Crear Receta</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/mi-perfil">
                  {/* CAMBIO AQUÍ: .nombre -> .name */}
                  <Nav.Link>Hola, {usuarioActual.name}</Nav.Link>
                </LinkContainer>
                
                <Button variant="outline-secondary" onClick={logout} className="ms-2">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
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
        
      </Container> {/* --- CIERRA EL 'fluid' --- */}
    </Navbar>
  );
}