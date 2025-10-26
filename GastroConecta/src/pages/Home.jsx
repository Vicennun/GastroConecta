// src/pages/Home.jsx

import React from 'react';
import { Row, Col } from 'react-bootstrap'; 

import RecetaCard from '../components/RecetaCard';
import { useAuth } from '../context/AuthContext'; 

export default function Home() {
  const { usuarioActual, recetas } = useAuth();
  
  const nombreUsuario = usuarioActual ? usuarioActual.nombre.split(' ')[0] : 'Visitante';

  return (
    <> 
      {/* --- Saludo Personalizado --- */}
      <Row className="mb-4">
        <Col>
          <h1>Hola, {nombreUsuario}</h1>
          <p>Descubre las últimas recetas publicadas en GastroConecta.</p>
        </Col>
      </Row>

      {/* --- Feed de Recetas --- */}
      <Row>
        {recetas.map((receta) => (
          <Col md={6} lg={4} key={receta.id}>
            <RecetaCard receta={receta} />
          </Col> 
        ))}
      </Row>
    </>
  );
}
