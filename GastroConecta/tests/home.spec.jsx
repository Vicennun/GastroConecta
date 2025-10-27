import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../src/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Home from '../src/pages/Home';
import recetasTestData from '../src/data/recetas.json';

describe('Componente Home', () => {

  // Prueba 1: Buscar el título real
  it('renderiza el título principal "Encuentra tu Próxima Receta Favorita"', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    );
    // Cambiado para buscar el texto exacto del H1
    expect(screen.getByText(/Encuentra tu Próxima Receta Favorita/i)).toBeInTheDocument();
  });

  // Prueba 2: Buscar el texto descriptivo real
  it('renderiza el subtítulo descriptivo', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    );
    // Cambiado para buscar parte del texto real del párrafo
    expect(screen.getByText(/Busca por nombre, ingrediente o filtra/i)).toBeInTheDocument();
  });

  // Prueba 3: Buscar el placeholder real
  it('renderiza el campo de búsqueda de recetas', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Home />
        </AuthProvider>
      </BrowserRouter>
    );
    // Cambiado para buscar el placeholder "Buscar..."
    expect(screen.getByPlaceholderText(/Buscar\.\.\./i)).toBeInTheDocument();
  });

   it('muestra la sección "Recetas Recientes" cuando hay recetas', async () => {
  render(
    <BrowserRouter>
      <AuthProvider initialRecipes={recetasTestData}> {/* <-- Aquí */}
        <Home />
      </AuthProvider>
    </BrowserRouter>
  );
  expect(await screen.findByText("Recetas Recientes")).toBeInTheDocument();
});

});