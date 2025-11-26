import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OPCIONES_DIETETICAS = ["Sin Gluten", "Vegano", "Vegetariano", "Sin Lácteos", "Bajo en Azúcar", "Apto para Diabéticos"];

export default function CrearReceta() {
  const navigate = useNavigate();
  const { usuarioActual, agregarReceta } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [fotoFile, setFotoFile] = useState(null);
  const [ingredientes, setIngredientes] = useState('');
  const [pasos, setPasos] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleEtiquetaChange = (e) => {
    const { value, checked } = e.target;
    if (checked) setEtiquetas(prev => [...prev, value]);
    else setEtiquetas(prev => prev.filter(etiqueta => etiqueta !== value));
  };

  // --- FUNCIÓN CLAVE: Convertir archivo a Texto Base64 ---
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!titulo || !descripcion || !ingredientes || !pasos) {
      setError('Completa los campos obligatorios.');
      return;
    }

    const ingredientesArray = ingredientes.split('\n').filter(l => l.trim()).map(line => {
        const parts = line.split(',');
        return { nombre: parts[0]?.trim(), cantidad: parts[1]?.trim() || '' };
    });
    
    const pasosArray = pasos.split('\n').filter(l => l.trim());

    // Convertir imagen si existe
    let fotoBase64 = 'https://via.placeholder.com/300x200.png?text=Sin+Foto';
    if (fotoFile) {
        try {
            fotoBase64 = await convertToBase64(fotoFile);
        } catch (err) {
            setError('Error al procesar la imagen');
            return;
        }
    }

    const nuevaReceta = {
      titulo,
      descripcion,
      tiempoPreparacion: tiempo,
      autorId: usuarioActual.id,
      autorNombre: usuarioActual.name, // Usamos .name del backend
      foto: fotoBase64, // Enviamos el string largo
      ingredientes: ingredientesArray,
      pasos: pasosArray,
      etiquetasDieteticas: etiquetas,
      confirmado: false 
    };

    try {
      await agregarReceta(nuevaReceta);
      setExito('¡Receta creada! Redirigiendo...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Error al guardar. Intenta de nuevo.');
    }
  };

  return (
    <Row className="justify-content-md-center my-5">
      <Col md={8}>
        <h2 className="text-center mb-4">Crear Nueva Receta</h2>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          {exito && <Alert variant="success">{exito}</Alert>}

          <Form.Group className="mb-3"><Form.Label>Título</Form.Label><Form.Control type="text" value={titulo} onChange={e=>setTitulo(e.target.value)} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Descripción</Form.Label><Form.Control as="textarea" rows={3} value={descripcion} onChange={e=>setDescripcion(e.target.value)} /></Form.Group>
          
          <Row>
             <Col md={6}><Form.Group className="mb-3"><Form.Label>Tiempo</Form.Label><Form.Control type="text" value={tiempo} onChange={e=>setTiempo(e.target.value)} /></Form.Group></Col>
             <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Foto</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={e=>setFotoFile(e.target.files[0])} />
                </Form.Group>
             </Col>
          </Row>

          <Form.Group className="mb-3"><Form.Label>Ingredientes (Nombre, Cantidad)</Form.Label><Form.Control as="textarea" rows={5} value={ingredientes} onChange={e=>setIngredientes(e.target.value)} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Pasos</Form.Label><Form.Control as="textarea" rows={5} value={pasos} onChange={e=>setPasos(e.target.value)} /></Form.Group>

          <Form.Group className="mb-3">
             <Form.Label>Etiquetas</Form.Label>
             <div>{OPCIONES_DIETETICAS.map(op => (
                <Form.Check inline key={op} label={op} value={op} type="checkbox" onChange={handleEtiquetaChange} />
             ))}</div>
          </Form.Group>

          <Button type="submit" className="w-100">Publicar Receta</Button>
        </Form>
      </Col>
    </Row>
  );
}