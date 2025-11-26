// src/pages/CrearReceta.jsx

import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Lista fija de opciones para el RF-003
const OPCIONES_DIETETICAS = [
  "Sin Gluten",
  "Vegano",
  "Vegetariano",
  "Sin Lácteos",
  "Bajo en Azúcar",
  "Apto para Diabéticos"
];

export default function CrearReceta() {
  const navigate = useNavigate();
  const { usuarioActual, agregarReceta } = useAuth();

  // --- Estados para todos los campos ---
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempo, setTiempo] = useState('');
  
  // VOLVEMOS A: URL de texto simple
  const [fotoUrl, setFotoUrl] = useState('');
  
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // --- Manejador para las casillas (etiquetas) ---
  const handleEtiquetaChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEtiquetas(prev => [...prev, value]);
    } else {
      setEtiquetas(prev => prev.filter(etiqueta => etiqueta !== value));
    }
  };

  // --- Manejador del envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // --- Validación ---
    if (!titulo || !descripcion || !ingredientes || !pasos) {
      setError('Por favor, completa los campos obligatorios: Título, Descripción, Ingredientes y Pasos.');
      return;
    }

    // --- Procesamiento de datos ---
    const ingredientesArray = ingredientes.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const parts = line.split(',');
        return { 
          nombre: parts[0]?.trim(), 
          cantidad: parts[1]?.trim() || '' 
        };
      });
      
    const pasosArray = pasos.split('\n').filter(line => line.trim() !== '');

    // Construimos el objeto de la nueva receta
    const nuevaReceta = {
      titulo,
      descripcion,
      tiempoPreparacion: tiempo,
      autorId: usuarioActual.id,
      autorNombre: usuarioActual.name, // Usamos el nombre real del usuario
      
      // Usamos la URL ingresada o una por defecto
      foto: fotoUrl || 'https://via.placeholder.com/300x200.png?text=Sin+Foto',
      
      ingredientes: ingredientesArray,
      pasos: pasosArray,
      etiquetasDieteticas: etiquetas,
      confirmado: false, // Por defecto false para que el admin la apruebe
    };

    try {
      await agregarReceta(nuevaReceta);
      
      setExito('¡Receta creada con éxito! Serás redirigido al inicio.');
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error al guardar la receta. Intenta de nuevo.');
    }
  };

  return (
    <Row className="justify-content-md-center my-5">
      <Col md={8}>
        <h2 className="text-center mb-4">Crear Nueva Receta</h2>
        
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {exito && <Alert variant="success">{exito}</Alert>}

          {/* --- Título --- */}
          <Form.Group className="mb-3" controlId="formTitulo">
            <Form.Label>Título de la Receta</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Form.Group>

          {/* --- Descripción --- */}
          <Form.Group className="mb-3" controlId="formDescripcion">
            <Form.Label>Descripción Corta</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>

          <Row>
            {/* --- Tiempo de Preparación --- */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTiempo">
                <Form.Label>Tiempo de Preparación (ej. 45 min)</Form.Label>
                <Form.Control
                  type="text"
                  value={tiempo}
                  onChange={(e) => setTiempo(e.target.value)}
                />
              </Form.Group>
            </Col>
            
            {/* --- URL de la Foto (Restaurado) --- */}
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formFoto">
                <Form.Label>URL de la Foto</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                />
                <Form.Text muted>
                  Copia y pega la dirección de una imagen de internet.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* --- Ingredientes --- */}
          <Form.Group className="mb-3" controlId="formIngredientes">
            <Form.Label>Ingredientes</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
            />
            <Form.Text muted>
              Un ingrediente por línea. Formato: <strong>Nombre, Cantidad</strong> (ej: Harina, 1 taza)
            </Form.Text>
          </Form.Group>

          {/* --- Pasos --- */}
          <Form.Group className="mb-3" controlId="formPasos">
            <Form.Label>Pasos de Preparación</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={pasos}
              onChange={(e) => setPasos(e.target.value)}
            />
            <Form.Text muted>Un paso por línea.</Form.Text>
          </Form.Group>

          {/* --- Etiquetas Dietéticas --- */}
          <Form.Group className="mb-3" controlId="formEtiquetas">
            <Form.Label>Etiquetas Dietéticas</Form.Label>
            <div>
              {OPCIONES_DIETETICAS.map((opcion) => (
                <Form.Check
                  inline
                  key={opcion}
                  label={opcion}
                  type="checkbox"
                  value={opcion}
                  onChange={handleEtiquetaChange}
                />
              ))}
            </div>
          </Form.Group>
          
          <Button variant="primary" type="submit" className="w-100 mt-3">
            Publicar Receta
          </Button>
        </Form>
      </Col>
    </Row>
  );
}