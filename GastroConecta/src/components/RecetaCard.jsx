// src/components/RecetaCard.jsx

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function RecetaCard({ receta }) {
  return (
    // 1. Añadimos clases para sombra y quitar borde
    <Card className="mb-4 shadow-sm border-0">
      <Card.Img 
        variant="top" 
        src={receta.foto} 
        alt={receta.titulo} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <Card.Body>
        <Card.Title>{receta.titulo}</Card.Title>
        
        {/* 2. Añadimos el tiempo de preparación */}
        <Card.Subtitle className="mb-2 text-muted">
          <small>
            Tiempo: {receta.tiempoPreparacion || 'No especificado'}
          </small>
        </Card.Subtitle>

        <Card.Text>
          Por: {receta.autorNombre}
        </Card.Text>
        <Button variant="primary" as={Link} to={`/receta/${receta.id}`}>
          Ver Receta
        </Button>
      </Card.Body>
    </Card>
  );
}
