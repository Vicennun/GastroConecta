import React, { useState } from 'react'; 
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Image, 
  Badge, 
  Button, 
  ListGroup, 
  Card, 
  Form, 
  Alert,
  Toast, 
  ToastContainer 
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import RatingDisplay, { StarDisplay } from '../components/SistemaRating'; 

export default function DetalleReceta() {
  const { id } = useParams();
  
  const { 
    recetas, 
    usuarioActual, 
    toggleLikeReceta, 
    agregarComentario, 
    toggleGuardarReceta,
    toggleSeguirUsuario 
  } = useAuth();

  const [nuevoComentario, setNuevoComentario] = useState('');
  const [errorComentario, setErrorComentario] = useState('');
  
  const [showSaveError, setShowSaveError] = useState(false);
  // [MODIFICACIÓN 1] Nuevo estado para el error de "Me gusta"
  const [showLikeError, setShowLikeError] = useState(false); 

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
  
  // --- VERIFICACIÓN de AUTORÍA ---
  const esMiReceta = usuarioActual && usuarioActual.id === receta.autorId;

  // --- MODIFICACIÓN: handleLike ---
  const handleLike = () => {
    if (!usuarioActual) return;
    
    // [MODIFICACIÓN 2] Lógica para mostrar el error solo al hacer clic si es mi receta
    if (esMiReceta) {
      setShowLikeError(true);
      // Ocultar automáticamente el Toast después de 3 segundos
      setTimeout(() => setShowLikeError(false), 3000); 
      // Aseguramos que el error de Guardar esté oculto
      setShowSaveError(false); 
      return; 
    }
    
    // Si se puede dar like, ocultar el error (por si acaso)
    setShowLikeError(false);
    toggleLikeReceta(receta.id); 
  };
  // --- FIN MODIFICACIÓN ---


  const handleGuardar = () => {
     if (!usuarioActual) return;
     
     if (esMiReceta) {
      setShowSaveError(true);
      setTimeout(() => setShowSaveError(false), 3000); 
      // Aseguramos que el error de Like esté oculto
      setShowLikeError(false); 
      return; 
     }

     setShowSaveError(false);
     toggleGuardarReceta(receta.id);
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
  
  return (
    <> {/* Fragment para envolver el contenedor principal y el ToastContainer */}
      <Container className="my-5"> 
        <Row>
          <Col md={8}>
            {!receta.confirmado && (
              <Badge bg="warning" text="dark" className="mb-2">
                Pendiente de Confirmación
              </Badge>
            )}
            <h1>{receta.titulo}</h1>
            <p className="text-muted">
              Por: <Link to={`/perfil/${receta.autorId}`}>{receta.autorNombre}</Link> | Tiempo: {receta.tiempoPreparacion}
            </p>
            
            <RatingDisplay receta={receta} />
            
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

            {/* Mensaje de error de Guardar se ha movido al ToastContainer */}

            {/* Botones de Acción */}
            <div className="mt-3">
              <Button 
                variant={dioLike ? "primary" : "outline-primary"} 
                onClick={handleLike} 
                className="me-2"
                // Deshabilitado si no hay usuario logueado
                disabled={!usuarioActual} 
                // [MODIFICACIÓN 3] Tooltip para "Me gusta"
                title={esMiReceta ? "No puedes dar Me gusta a tu propia receta" : ""} 
              >
                {dioLike ? "Te gusta" : "Me gusta"} ({likes.length})
              </Button>
              <Button 
                variant={estaGuardada ? "success" : "outline-success"}
                onClick={handleGuardar}
                disabled={!usuarioActual} 
                title={esMiReceta ? "No puedes guardar tu propia receta" : ""}
              >
                {estaGuardada ? "Guardado" : "Guardar"}
              </Button>
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
                  </ListGroup.Item>
                ))
              ) : (
                <p className="text-muted">No hay comentarios aún. ¡Sé el primero!</p>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container> 

      {/* --- NUEVO: TOAST FLOTANTE DINÁMICO --- */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1050 }}>
          <Toast 
              onClose={() => { setShowSaveError(false); setShowLikeError(false); }}
              show={showSaveError || showLikeError} 
              delay={3000} 
              autohide
              bg="warning" 
          >
              <Toast.Header>
                  <strong className="me-auto text-dark">Advertencia</strong>
              </Toast.Header>
              <Toast.Body className="text-dark"> 
                 
                  {showSaveError && "No puedes guardar tu propia receta en tu recetario."}
                  {showLikeError && "No puedes dar Me gusta a tu propia receta."}
              </Toast.Body>
          </Toast>
      </ToastContainer>
     
    </>
  );
}