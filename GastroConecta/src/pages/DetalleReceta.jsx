// src/pages/DetalleReceta.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Badge, Button, ListGroup } from 'react-bootstrap';

// 1. IMPORTA el hook 'useAuth'
import { useAuth } from '../context/AuthContext';
// 2. QUITA la importación estática de 'recetasData'

export default function DetalleReceta() {
  // 3. Obtiene el ID de la URL
  const { id } = useParams();
  
  // 4. Obtiene la lista de recetas ACTUALIZADA desde el Contexto
  const { recetas } = useAuth();

  // 5. Busca la receta en la lista del Contexto (no en el JSON)
  const receta = recetas.find((r) => r.id == id);

  // 6. ¿Qué pasa si la receta no existe? (Esta lógica sigue igual)
  if (!receta) {
    return (
      <Container className="text-center mt-5">
        <h2>Receta no encontrada</h2>
        <p>La receta que buscas no existe o fue eliminada.</p>
        <Button as={Link} to="/">Volver al Inicio</Button>
      </Container>
    );
  }
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
    setNuevoComentario(''); // Limpiar el campo
  };
  // 7. Si la receta SÍ existe, la mostramos (Esta lógica sigue igual)
  return (
    <>
      <Row>
        {/* --- Columna de Imagen y Título --- */}
        <Col md={8}>
          <h1>{receta.titulo}</h1>
          <p className="text-muted">
            Por: {receta.autorNombre} | Tiempo: {receta.tiempoPreparacion}
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
            {receta.etiquetasDieteticas.map((etiqueta, index) => (
              <Badge pill bg="info" key={index} className="me-2 mb-2">
                {etiqueta}
              </Badge>
            ))}
          </div>
        </Col>

        {/* --- Columna de Ingredientes --- */}
        <Col md={4}>
          <h4>Ingredientes</h4>
          <ListGroup variant="flush">
            {receta.ingredientes.map((ing, index) => (
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
            {receta.pasos.map((paso, index) => (
              <ListGroup.Item as="li" key={index}>{paso}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* --- Fila de Comentarios (Próximamente) --- */}
      <Row className="my-5">
        <Col>
          <h4>Comentarios</h4>
          <p className="text-muted">(Sistema de comentarios irá aquí)</p>
        </Col>
      </Row>
    </>
  );
}
