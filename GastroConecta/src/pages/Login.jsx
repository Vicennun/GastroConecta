// src/pages/Login.jsx

import React, { useState } from 'react';
// 1. Añade 'Card' a las importaciones
import { Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    try {
      await login(email, password);
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
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            
            <Form onSubmit={handleSubmit}>
              
              {error && <Alert variant="danger">{error}</Alert>}

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
              
              <Button variant="primary" type="submit" className="w-100">
                Ingresar
              </Button>
            </Form>

            <div className="w-100 text-center mt-3">
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </div>
          </Card.Body>
        </Card>
        {/* --- FIN DE LA CARD --- */}

      </Col>
    </Row>
  );
}