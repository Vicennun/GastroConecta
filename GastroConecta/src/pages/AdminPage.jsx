// src/pages/AdminPage.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { usuarioActual, recetas, confirmarReceta } = useAuth();

  // 1. Verificar si el usuario está logueado y es admin
  if (!usuarioActual || usuarioActual.rol !== 'admin') {
    // Si no es admin o no está logueado, redirigir al inicio
    return <Navigate to="/" />; 
  }
  
  // 2. Filtrar recetas pendientes
  const recetasPendientes = recetas.filter(r => !r.confirmado);

  const handleConfirmar = (recetaId) => {
    confirmarReceta(recetaId);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <h2 className="text-center mb-4">Panel de Administración - Recetas Pendientes</h2>
          
          {recetasPendientes.length === 0 ? (
            <Card className="text-center p-4">
              <Card.Text className="lead mb-0">No hay recetas pendientes de confirmación. ¡Todo limpio! 🎉</Card.Text>
            </Card>
          ) : (
            <Row>
              {recetasPendientes.map((receta) => (
                <Col md={6} lg={4} key={receta.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={receta.foto} 
                      alt={receta.titulo} 
                      style={{ height: '150px', objectFit: 'cover' }} 
                    />
                    <Card.Body>
                      <Badge bg="warning" text="dark" className="mb-2">
                        PENDIENTE
                      </Badge>
                      <Card.Title>{receta.titulo}</Card.Title>
                      <Card.Text className="text-muted">
                        Por: {receta.autorNombre}
                      </Card.Text>
                      <Card.Text className="text-muted">
                         ID: {receta.id}
                      </Card.Text>
                      
                      <Button 
                        variant="success" 
                        onClick={() => handleConfirmar(receta.id)}
                        className="w-100 mt-2"
                      >
                        Confirmar Receta
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

        </Col>
      </Row>
    </Container>
  );
}