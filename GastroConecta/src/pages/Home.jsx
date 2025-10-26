// src/pages/Home.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// 1. Importa los datos falsos y el componente Card
import recetasData from '../data/recetas.json';
import RecetaCard from '../components/RecetaCard';
import { useAuth } from '../context/AuthContext'; // 2. Importa el Auth

export default function Home() {
  // 3. Obtén el usuario para personalizar el saludo
  const { usuarioActual } = useAuth();
  
  const nombreUsuario = usuarioActual ? usuarioActual.nombre.split(' ')[0] : 'Visitante';

  return (
    <Container>
      {/* --- Saludo Personalizado --- */}
      <Row className="mb-4">
        <Col>
          <h1>Hola, {nombreUsuario}</h1>
          <p>Descubre las últimas recetas publicadas en GastroConecta.</p>
        </Col>
      </Row>

      {/* --- Feed de Recetas --- */}
      <Row>
        {recetasData.map((receta) => (
          // Usamos el grid de Bootstrap
          <Col md={6} lg={4} key={receta.id}>
            <RecetaCard receta={receta} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}