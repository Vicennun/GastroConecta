import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Alert, Badge, ListGroup } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import RecetaCard from '../components/RecetaCard'; // Reutilizamos la card

export default function MiPerfil() {
  const { usuarioActual, recetas, usuarios } = useAuth();

  // Si no hay usuario, redirigir al Login
  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  // --- 1. Filtrar las recetas creadas por el usuario ---
  const misRecetasCreadas = recetas
    .filter(receta => receta.autorId === usuarioActual.id)
    .sort((a, b) => b.id - a.id); // Ordenar por más nuevas primero

  // --- 2. Obtener las recetas guardadas (Recetario Personal) ---
  const miRecetarioIds = usuarioActual.recetario || [];
  const misRecetasGuardadas = recetas.filter(receta => 
    miRecetarioIds.includes(receta.id)
  );

  // --- 3. Obtener la lista de usuarios que sigue ---
  const siguiendoIds = usuarioActual.siguiendo || [];
  const usuariosSiguiendo = usuarios.filter(u => siguiendoIds.includes(u.id));

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        {/* --- Columna de Información Personal --- */}
        <Col md={4}>
          <Card className="mb-4 shadow-sm border-0">
            <Card.Body className="text-center">
              <Card.Title as="h2" className="mb-3">{usuarioActual.nombre}</Card.Title>
              <Card.Text className="text-muted">{usuarioActual.email}</Card.Text>
              {/* Aquí podrías agregar un botón para "Editar Perfil" en el futuro */}
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm border-0">
            <Card.Body>
              <Card.Title as="h5">Siguiendo ({usuariosSiguiendo.length})</Card.Title>
              <ListGroup variant="flush">
                {usuariosSiguiendo.length > 0 ? (
                  usuariosSiguiendo.map(u => (
                    <ListGroup.Item key={u.id}>
                      {u.nombre}
                      {/* En el futuro, esto podría ser un <Link> al perfil público de ese usuario */}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-muted">No sigues a nadie aún.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Columna de Recetas (Creadas y Guardadas) --- */}
        <Col md={8}>
          
          {/* --- Mis Recetas Creadas --- */}
          <h3 className="mb-3">Mis Recetas Creadas</h3>
          <Row>
            {misRecetasCreadas.length > 0 ? (
              misRecetasCreadas.map(receta => (
                <Col md={6} lg={6} key={receta.id} className="mb-4">
                  {/* Mostramos el estado "Pendiente" si no está confirmada */}
                  {!receta.confirmado && (
                    <Badge bg="warning" text="dark" className="mb-1">
                      Pendiente de Aprobación
                    </Badge>
                  )}
                  <RecetaCard receta={receta} />
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="secondary">
                  No has creado ninguna receta. ¡<Link to="/crear-receta">Anímate a crear una</Link>!
                </Alert>
              </Col>
            )}
          </Row>

          <hr className="my-4" />

          {/* --- Mi Recetario (Guardadas) --- */}
          <h3 className="mb-3">Mi Recetario (Recetas Guardadas)</h3>
          <Row>
            {misRecetasGuardadas.length > 0 ? (
              misRecetasGuardadas.map(receta => (
                <Col md={6} lg={6} key={receta.id} className="mb-4">
                  <RecetaCard receta={receta} />
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <Alert variant="secondary">
                  No has guardado ninguna receta. Explora el <Link to="/">inicio</Link> y guarda las que te gusten.
                </Alert>
              </Col>
            )}
          </Row>
          
        </Col>
      </Row>
    </Container>
  );
}
