// src/components/RecetaCard.jsx

import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
// 1. Importamos 'Link'
import { Link } from 'react-router-dom';

export default function RecetaCard({ receta }) {
  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Img 
        variant="top" 
        src={receta.foto} 
        alt={receta.titulo} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <Card.Body>
        
        {receta.confirmado && (
          <Badge bg="success" className="mb-2 d-block">
            Confirmada
          </Badge>
        )}
        {!receta.confirmado && (
          <Badge bg="warning" text="dark" className="mb-2 d-block">
            Pendiente de Confirmación
          </Badge>
        )}

        <Card.Title>{receta.titulo}</Card.Title>
        
        <Card.Subtitle className="mb-2 text-muted">
          <small>
            Tiempo: {receta.tiempoPreparacion || 'No especificado'}
          </small>
        </Card.Subtitle>

        {/* --- 2. AQUÍ ESTÁ EL CAMBIO --- */}
        <Card.Text>
          {/* Convertimos el nombre del autor en un enlace */}
          Por: <Link to={`/perfil/${receta.autorId}`}>{receta.autorNombre}</Link>
        </Card.Text>
        {/* --- Fin del cambio --- */}

        <Button variant="primary" as={Link} to={`/receta/${receta.id}`}>
          Ver Receta
        </Button>
      </Card.Body>
    </Card>
  );
}
