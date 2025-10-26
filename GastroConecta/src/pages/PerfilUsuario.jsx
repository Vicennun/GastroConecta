// src/pages/PerfilUsuario.jsx

import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Nav, Tab, Button, ListGroup } from 'react-bootstrap';
import RecetaCard from '../components/RecetaCard';

export default function PerfilUsuario() {
  const { id } = useParams(); 
  const { usuarios, recetas, usuarioActual, toggleSeguirUsuario } = useAuth();

  const usuario = usuarios.find(u => u.id == id);

  if (!usuario) {
    return (
      <Container className="text-center my-5">
        <h2>Usuario no encontrado</h2>
        <Link to="/">Volver al inicio</Link>
      </Container>
    );
  }

  if (usuarioActual && usuarioActual.id === usuario.id) {
    return <Navigate to="/mi-perfil" />;
  }

  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Filtra las recetas de este usuario (quitamos el filtro '&& r.confirmado')
  const recetasUsuario = recetas.filter(
    (r) => r.autorId === usuario.id
  );
  // --- FIN DEL CAMBIO ---

  const estaSiguiendo = usuarioActual ? usuarioActual.siguiendo.includes(usuario.id) : false;

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header as="h2" className="text-center p-3">
              Perfil de {usuario.nombre}
            </Card.Header>
            <Card.Body className="p-4">
              
              {usuarioActual && (
                <Button 
                  variant={estaSiguiendo ? 'secondary' : 'outline-secondary'}
                  onClick={() => toggleSeguirUsuario(usuario.id)}
                  className="mb-3 w-100"
                >
                  {estaSiguiendo ? `Dejar de seguir a ${usuario.nombre}` : `Seguir a ${usuario.nombre}`}
                </Button>
              )}
              
              <hr />

              <Tab.Container defaultActiveKey="recetas">
                <Nav variant="pills" className="mb-3 flex-wrap">
                  <Nav.Item>
                    <Nav.Link eventKey="recetas">Recetas ({recetasUsuario.length})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="seguidores">Seguidores ({(usuario.seguidores || []).length})</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="recetas">
                    <Row>
                      {recetasUsuario.length > 0 ? (
                        recetasUsuario.map((receta) => (
                          <Col md={6} lg={4} key={receta.id} className="mb-4">
                            <RecetaCard receta={receta} />
                          </Col>
                        ))
                      ) : (
                        // Texto actualizado para reflejar la nueva lógica
                        <Col><p className="text-muted">{usuario.nombre} aún no ha publicado recetas.</p></Col>
                      )}
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="seguidores">
                    <ListGroup variant="flush">
                      {(usuario.seguidores || []).length > 0 ? (
                        usuarios.filter(u => usuario.seguidores.includes(u.id)).map(user => (
                          <ListGroup.Item key={user.id} as={Link} to={`/perfil/${user.id}`} action>
                            {user.nombre}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p className="text-muted">{usuario.nombre} aún no tiene seguidores.</p>
                      )}
                    </ListGroup>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}