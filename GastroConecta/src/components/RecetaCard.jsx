// src/components/RecetaCard.jsx

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Usamos "destructuring" para recibir la receta como prop
export default function RecetaCard({ receta }) {
  return (
    <Card className="mb-4">
      <Card.Img 
        variant="top" 
        src={receta.foto} 
        alt={receta.titulo} 
        style={{ height: '200px', objectFit: 'cover' }} 
      />
      <Card.Body>
        <Card.Title>{receta.titulo}</Card.Title>
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