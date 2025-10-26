// src/pages/Registro.jsx

import React, { useState } from 'react';
// 1. Añade 'Card' a las importaciones
import { Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await register(nombre, email, password);
      navigate('/'); 
    } catch (err) {
      setError(err.message);
    }
  };

  // 2. Añadimos 'my-5' para dar espacio vertical
  return (
    <Row className="justify-content-md-center my-5">
      <Col md={6}>

        {/* --- 3. ENVOLVEMOS TODO EN UNA CARD --- */}
        <Card className="shadow-sm border-0">
          <Card.Body className="p-4"> {/* Damos más padding */}
            <h2 className="text-center mb-4">Crear Cuenta</h2>
            
            <Form onSubmit={handleSubmit}>
              
              {error && <Alert variant="danger">{error}</Alert>}

              {/* --- Campo Nombre --- */}
              <Form.Group className="mb-3" controlId="formBasicNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Form.Group>

              {/* --- Campo Email --- */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              {/* --- Campo Contraseña --- */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {/* --- Campo Confirmar Contraseña --- */}
              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              
              <Button variant="primary" type="submit" className="w-100">
                Registrarse
              </Button>
            </Form>

            <div className="w-100 text-center mt-3">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </div>
          </Card.Body>
        </Card>
        {/* --- FIN DE LA CARD --- */}

      </Col>
    </Row>
  );
}
