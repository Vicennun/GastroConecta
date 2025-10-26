// src/pages/DetalleReceta.jsx

import React, { useState } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Badge, Button, ListGroup, Card, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function DetalleReceta() {
  const { id } = useParams();
  
  // --- ¡AQUÍ ESTÁ EL CAMBIO! ---
  // Cambiamos 'toggleLike' por 'toggleLikeReceta'
  const { 
    recetas, 
    usuarioActual, 
    toggleLikeReceta, // <--- Nombre corregido
    agregarComentario, 
    toggleGuardarReceta,
    toggleSeguirUsuario // Asegúrate que esta también esté si la usas (Parece que la quitaste en la última versión?)
  } = useAuth();
  // --- FIN DEL CAMBIO ---

  const [nuevoComentario, setNuevoComentario] = useState('');
  const [errorComentario, setErrorComentario] = useState('');

  const recetaIdNumero = Number(id);
  const receta = Array.isArray(recetas) ? recetas.find((r) => r.id === recetaIdNumero) : null;
  
  if (!receta) {
    console.error(`No se encontró la receta con ID: ${id}`); 
    return (
      <Container className="text-center mt-5">
        <h2>Receta no encontrada</h2>
        <p>La receta que buscas no existe, fue eliminada o aún no se ha cargado.</p>
        <Button as={Link} to="/">Volver al Inicio</Button>
      </Container>
    );
  }

  const likes = receta.likes || [];
  const comentarios = receta.comentarios || [];
  
  const dioLike = usuarioActual ? likes.includes(usuarioActual.id) : false;
  
  const recetarioUsuario = (usuarioActual && usuarioActual.recetario) ? usuarioActual.recetario : [];
  const estaGuardada = recetarioUsuario.includes(receta.id);

  // --- ¡AQUÍ TAMBIÉN CAMBIAMOS! ---
  // Ahora usamos la función con el nombre correcto
  const handleLike = () => {
    if (usuarioActual) { // Buena práctica: asegurar que el usuario existe
       toggleLikeReceta(receta.id); // <--- Nombre corregido
    }
  };
  // --- FIN DEL CAMBIO ---


  const handleGuardar = () => {
     if (usuarioActual) {
      toggleGuardarReceta(receta.id);
     }
  };
  
  const handleSubmitComentario = (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) {
      setErrorComentario("El comentario no puede estar vacío");
      return;
    }
     if (usuarioActual) {
      setErrorComentario('');
      agregarComentario(receta.id, nuevoComentario);
      setNuevoComentario(''); 
     }
  };
  
  // Lógica para seguir (si la tienes implementada)
  // const estaSiguiendo = usuarioActual ? usuarioActual.siguiendo.includes(receta.autorId) : false;
  // const esMiReceta = usuarioActual ? usuarioActual.id === receta.autorId : false;
  
  // const handleSeguir = () => {
  //   if (usuarioActual && !esMiReceta) {
  //     toggleSeguirUsuario(receta.autorId);
  //   }
  // };

  return (
    <Container className="my-5"> 
      <Row>
        <Col md={8}>
          {/* ... (resto del código de la columna izquierda sin cambios) ... */}
          {!receta.confirmado && (
            <Badge bg="warning" text="dark" className="mb-2">
              Pendiente de Confirmación
            </Badge>
          )}
          <h1>{receta.titulo}</h1>
           <p className="text-muted">
            Por: <Link to={`/perfil/${receta.autorId}`}>{receta.autorNombre}</Link> | Tiempo: {receta.tiempoPreparacion}
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
            {receta.etiquetasDieteticas && receta.etiquetasDieteticas.map((etiqueta, index) => (
              <Badge pill bg="info" key={index} className="me-2 mb-2">
                {etiqueta}
              </Badge>
            ))}
          </div>
          {/* Botones de Acción (ya usan handleLike y handleGuardar) */}
          <div className="mt-3">
            <Button 
              variant={dioLike ? "primary" : "outline-primary"} 
              onClick={handleLike} 
              className="me-2"
              disabled={!usuarioActual} 
            >
              {dioLike ? "Te gusta" : "Me gusta"} ({likes.length})
            </Button>
            <Button 
              variant={estaGuardada ? "success" : "outline-success"}
              onClick={handleGuardar}
              disabled={!usuarioActual} 
            >
              {estaGuardada ? "Guardado" : "Guardar"}
            </Button>
            {/* Botón Seguir (si lo tienes) */}
            {/* {usuarioActual && !esMiReceta && (
              <Button 
                variant={estaSiguiendo ? 'secondary' : 'outline-secondary'}
                onClick={handleSeguir}
                className="ms-2" 
              >
                {estaSiguiendo ? `Dejar de seguir` : `Seguir`}
              </Button>
            )} */}
          </div>
        </Col>

        {/* --- Columna de Ingredientes (sin cambios) --- */}
        <Col md={4}>
          <h4>Ingredientes</h4>
          <ListGroup variant="flush">
            {receta.ingredientes && receta.ingredientes.map((ing, index) => (
              <ListGroup.Item key={index}>
                <strong>{ing.cantidad}</strong> {ing.nombre}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* --- Fila de Pasos (sin cambios) --- */}
      <Row>
        <Col>
          <h4>Preparación</h4>
          <ListGroup as="ol" numbered>
            {receta.pasos && receta.pasos.map((paso, index) => (
              <ListGroup.Item as="li" key={index}>{paso}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* --- Fila de Comentarios (sin cambios) --- */}
      <Row className="my-5">
        <Col md={8}>
          <h4>Comentarios ({comentarios.length})</h4>
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
          <ListGroup variant="flush">
            {comentarios.length > 0 ? (
              comentarios.map(com => (
                <ListGroup.Item key={com.id} className="mb-2 border-bottom">
                  <strong>{com.autorNombre}</strong>
                  <p className="mb-0 mt-1">{com.texto}</p>
                   {/* Opcional: Mostrar fecha del comentario si la guardas */}
                   {/* <small className="text-muted">{new Date(com.fecha).toLocaleString()}</small> */}
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted">No hay comentarios aún. ¡Sé el primero!</p>
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container> 
  );
}