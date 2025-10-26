// src/components/Footer.jsx

import React from 'react';
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    // mt-5 (margen superior 5), py-4 (padding vertical 4)
    <footer className="mt-5 py-4 bg-dark text-white-50">
      <Container className="text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} GastroConecta</p>
        <p className="mb-0">
          <small>Proyecto de Desarrollo Fullstack - Grupo 18 (Duoc UC)</small>
        </p>
      </Container>
    </footer>
  );
}
