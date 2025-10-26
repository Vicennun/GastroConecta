// src/pages/Login.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // 1. Importa el Hook
import { useNavigate } from 'react-router-dom'; // 2. Importa useNavigate

export default function Login() {
  const { login } = useAuth(); // 3. Obtén la función de login
  const navigate = useNavigate(); // 4. Hook para redirigir

  const handleLoginSimulado = () => {
    login();      // 5. Llama a la función de login del contexto
    navigate('/'); // 6. Redirige al usuario al Home
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <p>Aquí irá el formulario de Bootstrap...</p>
      
      {/* 7. Botón para probar la simulación */}
      <Button onClick={handleLoginSimulado}>
        Simular Login (Vicente)
      </Button>
    </div>
  );
}