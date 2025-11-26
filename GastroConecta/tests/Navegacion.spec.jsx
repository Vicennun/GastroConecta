import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // vi es el "mock" de Vitest
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../src/context/AuthContext';
import Navegacion from '../src/components/Navegacion'; // El componente a probar

// Describimos las pruebas para el componente Navegacion
describe('Componente Navegacion', () => {

  // Caso 1: Probar cómo se ve cuando el usuario NO está logueado
  it('muestra "Iniciar Sesión" y "Registro" cuando el usuario no está autenticado', () => {
    
    // Renderizamos el componente con sus providers.
    // AuthProvider por defecto no tendrá usuario.
    render(
      <BrowserRouter>
        <AuthProvider>
          <Navegacion />
        </AuthProvider>
      </BrowserRouter>
    );

    // Verificamos que los enlaces públicos existan
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByText(/Registro/i)).toBeInTheDocument();

    // Verificamos que los enlaces privados NO existan
    // usamos queryByText (devuelve null si no lo encuentra)
    expect(screen.queryByText(/Crear Receta/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cerrar Sesión/i)).not.toBeInTheDocument();
  });

  // Caso 2: Probar cómo se ve cuando el usuario SÍ está logueado
  it('muestra "Hola, [nombre]", "Crear Receta" y "Cerrar Sesión" cuando el usuario está autenticado', () => {
    
    // Creamos un usuario "mock" (simulado)
    const mockUsuario = {
      id: 1,
      nombre: 'Vicente Test',
      email: 'vicente@test.com'
    };

    // Creamos un valor de contexto simulado
    const mockContextValue = {
      usuarioActual: mockUsuario,
      logout: vi.fn(), // vi.fn() es una función "espía" o mock
      // Añadimos el resto de funciones del context (aunque no se usen aquí) para evitar errores
      login: vi.fn(),
      register: vi.fn(),
      agregarReceta: vi.fn(),
      toggleLikeReceta: vi.fn(),
      toggleGuardarReceta: vi.fn(),
      agregarComentario: vi.fn(),
      toggleSeguirUsuario: vi.fn(),
      recetas: [],
      usuarios: []
    };

    // Renderizamos el componente, pero en lugar de AuthProvider,
    // usamos AuthContext.Provider para "inyectar" nuestro usuario simulado.
    render(
      <BrowserRouter>
        <AuthContext.Provider value={mockContextValue}>
          <Navegacion />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Verificamos que los enlaces privados existan
    expect(screen.getByText(/Hola, Vicente Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Crear Receta/i)).toBeInTheDocument();
    expect(screen.getByText(/Cerrar Sesión/i)).toBeInTheDocument();

    // Verificamos que los enlaces públicos NO existan
    expect(screen.queryByText(/Iniciar Sesión/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Registro/i)).not.toBeInTheDocument();
  });

});