// src/pages/MiPerfil.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Tab, Nav, ListGroup } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import RecetaCard from '../components/RecetaCard';

export default function MiPerfil() {
  // Agregamos 'usuarios' para que no falle la carga de seguidores
  const { usuarioActual, recetas, usuarios } = useAuth();

  if (!usuarioActual) {
    return <Navigate to="/login" />;
  }

  // --- PROTECCIÓN 1: Listas de amigos ---
  // Si el backend no trae estos campos, usamos arrays vacíos []
  const siguiendo = usuarioActual.siguiendo || [];
  const seguidores = usuarioActual.seguidores || [];

  // Evitamos fallos al filtrar si 'usuarios' aún no carga
  const listaUsuariosSeguros = usuarios || [];
  const listaSiguiendo = listaUsuariosSeguros.filter(u => siguiendo.includes(u.id));
  const listaSeguidores = listaUsuariosSeguros.filter(u => seguidores.includes(u.id));

  // --- PROTECCIÓN 2: Mis Recetas ---
  const misRecetas = recetas.filter(
    (r) => r.autorId === usuarioActual.id
  );

  // --- PROTECCIÓN 3 (CRÍTICA): Recetario (Donde te falló) ---
  // Extraemos la lista de guardados de forma segura
  const idsGuardados = usuarioActual.recetario || []; 
  
  const recetasGuardadas = recetas.filter(
    (r) => idsGuardados.includes(r.id)
  );

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm border-0">
            <Card.Header as="h2" className="text-center p-3">
              Mi Perfil
            </Card.Header>
            <Card.Body className="p-4">
              {/* Usamos .name porque eso viene del Backend Java */}
              <Card.Title>{usuarioActual.name}</Card.Title>
              <Card.Subtitle className="mb-4 text-muted">
                {usuarioActual.email}
              </Card.Subtitle>
              
              <hr />

              <Tab.Container defaultActiveKey="mis-recetas">
                <Nav variant="pills" className="mb-3 flex-wrap"> 
                  <Nav.Item>
                    <Nav.Link eventKey="mis-recetas">Mis Recetas ({misRecetas.length})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="guardadas">Mi Recetario ({recetasGuardadas.length})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="siguiendo">Siguiendo ({listaSiguiendo.length})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="seguidores">Seguidores ({listaSeguidores.length})</Nav.Link>
                  </Nav.Item>
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey="mis-recetas">
                    <Row>
                      {misRecetas.length > 0 ? (
                        misRecetas.map((receta) => (
                          <Col md={6} lg={4} key={receta.id} className="mb-4">
                            <RecetaCard receta={receta} />
                          </Col>
                        ))
                      ) : (
                        <Col><p className="text-muted">Aún no has creado ninguna receta.</p></Col>
                      )}
                    </Row>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="guardadas">
                    <Row>
                      {recetasGuardadas.length > 0 ? (
                        recetasGuardadas.map((receta) => (
                          <Col md={6} lg={4} key={receta.id} className="mb-4">
                            <RecetaCard receta={receta} />
                          </Col>
                        ))
                      ) : (
                        <Col><p className="text-muted">Aún no has guardado recetas.</p></Col>
                      )}
                    </Row>
                  </Tab.Pane>

                  <Tab.Pane eventKey="siguiendo">
                    <ListGroup variant="flush">
                      {listaSiguiendo.length > 0 ? (
                        listaSiguiendo.map(user => (
                          <ListGroup.Item key={user.id} as={Link} to={`/perfil/${user.id}`} action>
                            {user.name} {/* Ojo: Usar .name aquí también */}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p className="text-muted">Aún no sigues a nadie.</p>
                      )}
                    </ListGroup>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="seguidores">
                    <ListGroup variant="flush">
                      {listaSeguidores.length > 0 ? (
                        listaSeguidores.map(user => (
                          <ListGroup.Item key={user.id} as={Link} to={`/perfil/${user.id}`} action>
                            {user.name} {/* Ojo: Usar .name aquí también */}
                          </ListGroup.Item>
                        ))
                      ) : (
                        <p className="text-muted">Aún no tienes seguidores.</p>
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