// src/pages/DetalleReceta.jsx

import React from 'react';
import { useParams } from 'react-router-dom';

export default function DetalleReceta() {
  // El hook useParams() nos da el ID de la URL
  const { id } = useParams();
  
  // (En el futuro, aquí buscaremos la receta en el JSON usando este ID)

  return (
    <div>
      <h1>Página de Detalle de Receta</h1>
      <p>Mostrando receta con ID: <strong>{id}</strong></p>
    </div>
  );
}