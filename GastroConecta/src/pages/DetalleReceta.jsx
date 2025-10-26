// src/pages/DetalleReceta.jsx

// 1. Asegúrate de importar useState
import React, { useState } from 'react'; 
import { useParams, Link } from 'react-router-dom';
// 2. Asegúrate de importar todo lo necesario de react-bootstrap
import { Container, Row, Col, Image, Badge, Button, ListGroup, Card, Form, Alert } from 'react-bootstrap';

import { useAuth } from '../context/AuthContext';

export default function DetalleReceta() {
  const { id } = useParams();
  
  // 3. Obtén todas las funciones y datos necesarios del contexto
  const { recetas, usuarioActual, toggleLike, agregarComentario, toggleGuardarReceta } = useAuth();

  // 4. Declara los estados para el formulario de comentarios
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [errorComentario, setErrorComentario] = useState('');

  // 5. CORRECCIÓN: Convierte el 'id' de la URL (string) a número antes de buscar
  const recetaIdNumero = Number(id);
  const receta = Array.isArray(recetas) ? recetas.find((r) => r.id === recetaIdNumero) : null;
  // La línea original era: const receta = recetas.find((r) => r.id == id);

  // --- El resto del código que maneja el caso de receta no encontrada ---
  if (!receta) {
    // Es posible que las recetas aún no se hayan cargado, o el ID sea inválido
    console.error(`No se encontró la receta con ID: ${id}`); // Añade esto para depuración
    return (
      <Container className="text-center mt-5">
        <h2>Receta no encontrada</h2>
        <p>La receta que buscas no existe, fue eliminada o aún no se ha cargado.</p>
        <Button as={Link} to="/">Volver al Inicio</Button>
      </Container>
    );
  }

  // --- Lógica para "Me Gusta", "Guardar" y Comentarios (como la teníamos antes) ---
  const likes = receta.likes || [];
  const comentarios = receta.comentarios || [];
  
  const dioLike = usuarioActual ? likes.includes(usuarioActual.id) : false;
  
  const recetarioUsuario = (usuarioActual && usuarioActual.recetario) ? usuarioActual.recetario : [];
  const estaGuardada = recetarioUsuario.includes(receta.id);

  const handleLike = () => {
    toggleLike(receta.id);
  };

  const handleGuardar = () => {
    toggleGuardarReceta(receta.id);
  };
  
  const handleSubmitComentario = (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) {
      setErrorComentario("El comentario no puede estar vacío");
      return;
    }
    setErrorComentario('');
    agregarComentario(receta.id, nuevoComentario);
    setNuevoComentario(''); 
  };
  // --- FIN LÓGICA ---

  return (
    
    // 6. Añade el Container que faltaba en la versión que subiste
    <Container className="my-5"> 
      <Row>
        {/* --- Columna de Imagen y Título --- */}
        <Col md={8}>
          
          {!receta.confirmado && (
            <Badge bg="warning" text="dark" className="mb-2">
              Pendiente de Confirmación
            </Badge>
          )}

          <h1>{receta.titulo}</h1>
          <p className="text-muted">
            {/* --- AQUÍ ESTÁ EL CAMBIO --- */}
            Por: <Link to={`/perfil/${receta.autorId}`}>{receta.autorNombre}</Link> | Tiempo: {receta.tiempoPreparacion}
            {/* --- FIN DEL CAMBIO --- */}
          </p>
          
          <Image 
            src={receta.foto} 
            alt={receta.titulo} 
            fluid 
            rounded 
            className="mb-3" 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
          
          <p>{receta.descripcion}</p>

          <div>
            {/* 7. Añade comprobación por si etiquetasDieteticas no existe */}
            {receta.etiquetasDieteticas && receta.etiquetasDieteticas.map((etiqueta, index) => (
              <Badge pill bg="info" key={index} className="me-2 mb-2">
                {etiqueta}
              </Badge>
            ))}
          </div>
          
          {/* Botones de Acción */}
          <div className="mt-3">
            <Button 
              variant={dioLike ? "primary" : "outline-primary"} 
              onClick={handleLike} 
              className="me-2"
              disabled={!usuarioActual} // Deshabilitado si no hay usuario
            >
              {dioLike ? "Te gusta" : "Me gusta"} ({likes.length})
            </Button>
            <Button 
              variant={estaGuardada ? "success" : "outline-success"}
              onClick={handleGuardar}
              disabled={!usuarioActual} // Deshabilitado si no hay usuario
            >
              {estaGuardada ? "Guardado" : "Guardar"}
            </Button>
          </div>
        </Col>

        {/* --- Columna de Ingredientes --- */}
        <Col md={4}>
          <h4>Ingredientes</h4>
          <ListGroup variant="flush">
            {/* 8. Añade comprobación por si ingredientes no existe */}
            {receta.ingredientes && receta.ingredientes.map((ing, index) => (
              <ListGroup.Item key={index}>
                <strong>{ing.cantidad}</strong> {ing.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* --- Fila de Pasos --- */}
      <Row>
        <Col>
          <h4>Preparación</h4>
          <ListGroup as="ol" numbered>
             {/* 9. Añade comprobación por si pasos no existe */}
            {receta.pasos && receta.pasos.map((paso, index) => (
              <ListGroup.Item as="li" key={index}>{paso}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* --- Fila de Comentarios --- */}
      <Row className="my-5">
        <Col md={8}>
          <h4>Comentarios ({comentarios.length})</h4>
          
          {/* Formulario para agregar comentario */}
          {usuarioActual ? (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Deja un comentario</Card.Title>
                <Form onSubmit={handleSubmitComentario}>
                  {errorComentario && <Alert variant="danger" size="sm">{errorComentario}</Alert>}
                  <Form.Group className="mb-2">
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      placeholder="Escribe tu opinión..."
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">Publicar</Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="secondary">
              <Link to="/login">Inicia sesión</Link> para dejar un comentario.
            </Alert>
          )}

          {/* Lista de comentarios existentes */}
          <ListGroup variant="flush">
            {comentarios.length > 0 ? (
              comentarios.map(com => (
                <ListGroup.Item key={com.id} className="mb-2 border-bottom">
                  <strong>{com.autorNombre}</strong>
                  <p className="mb-0 mt-1">{com.texto}</p>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted">No hay comentarios aún. ¡Sé el primero!</p>
            )}
          </ListGroup>

        </Col>
      </Row>
    </Container> // Cierra el Container
  );
}
