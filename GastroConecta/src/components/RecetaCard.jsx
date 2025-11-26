import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { StarDisplay } from './SistemaRating'; 

export default function RecetaCard({ receta }) {
  const { calculateAverageRating } = useAuth(); 
  
  //Calcular el rating promedio
  const averageRating = calculateAverageRating(receta.ratings);
  const totalVotes = receta.ratings ? receta.ratings.length : 0;
  
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
        
        
        <div className="mb-2">
            <StarDisplay rating={averageRating} count={totalVotes} size="1rem"/>
        </div>
       
        
        <Card.Subtitle className="mb-2 text-muted">
          <small>
            Tiempo: {receta.tiempoPreparacion || 'No especificado'}
          </small>
        </Card.Subtitle>

        
        <Card.Text>
          
          Por: <Link to={`/perfil/${receta.autorId}`}>{receta.autorNombre}</Link>
        </Card.Text>
        

        <Button variant="primary" as={Link} to={`/receta/${receta.id}`}>
          Ver Receta
        </Button>
      </Card.Body>
    </Card>
  );
}
