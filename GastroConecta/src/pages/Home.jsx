// src/pages/Home.jsx

import React, { useState } from 'react';
import { Row, Col, Form, InputGroup, Button, Container } from 'react-bootstrap';
import RecetaCard from '../components/RecetaCard';
import { useAuth } from '../context/AuthContext';
import { OPCIONES_DIETETICAS } from '../data/constants'; // Asegúrate que src/data/constants.js exista

export default function Home() {
  const auth = useAuth(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); 

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFilters(prev => checked ? [...prev, value] : prev.filter(f => f !== value));
  };

  // --- FUNCIÓN handleSearch REVISADA ---
 const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true); 

    const recetasActuales = auth.recetas || [];
    const term = searchTerm.toLowerCase();

    let filteredRecetas = recetasActuales.filter(receta => {
    
        // 3. Lógica de búsqueda por término
        const tituloMatch = receta.titulo && receta.titulo.toLowerCase().includes(term);
        const descMatch = receta.descripcion && receta.descripcion.toLowerCase().includes(term);
        const ingMatch = Array.isArray(receta.ingredientes) && receta.ingredientes.some(ing => ing.nombre && ing.nombre.toLowerCase().includes(term));
        return tituloMatch || descMatch || ingMatch;
    });

    // Filtro por etiquetas (se mantiene igual)
    if (selectedFilters.length > 0) {
        filteredRecetas = filteredRecetas.filter(receta =>
            Array.isArray(receta.etiquetasDieteticas) &&
            selectedFilters.every(filter => receta.etiquetasDieteticas.includes(filter))
        );
    }

    setSearchResults(filteredRecetas);
  };
  // --- FIN DE FUNCIÓN handleSearch ---

  // Estilo Hero dinámico
  const heroStyle = {
    padding: '1rem', 
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("./background.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center', 
    color: 'white',
    width: '100%',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: !hasSearched ? '78.5vh' : 'auto',
    transition: 'height 0.3s ease-in-out', 
  };

  return (
    <div className="d-flex flex-column flex-grow-1">

      {/* --- SECCIÓN HERO (ROW) --- */}
      <Row className="justify-content-center text-center gx-0 w-100" style={heroStyle}>
        <Col lg={8} md={10} xs={12}>
          <h1>Encuentra tu Próxima Receta Favorita</h1>
          <p className="lead">Busca por nombre, ingrediente o filtra...</p>
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar receta"
              />
              <Button variant="primary" type="submit">Buscar</Button>
            </InputGroup>
            <Form.Group className="mb-3 text-start">
              <Form.Label className="d-block mb-2">Filtros:</Form.Label>
              {OPCIONES_DIETETICAS.map((opcion) => (
                <Form.Check
                  inline
                  key={opcion}
                  id={`filter-${opcion}`}
                  label={opcion}
                  type="checkbox"
                  value={opcion}
                  onChange={handleFilterChange}
                  className="text-white"
                />
              ))}
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {/* --- SECCIÓN DE RESULTADOS --- */}
      {hasSearched && (
        <Container className="mt-4 py-4 flex-grow-1">
          <Row>
             <Col xs={12}><h2 className="mb-3">Resultados</h2></Col>
             {searchResults.length > 0 ? (
               searchResults.map((receta) => (
                 <Col md={6} lg={4} key={receta.id} className="mb-4">
                    <RecetaCard receta={receta} />
                 </Col>
               ))
             ) : (
               <Col xs={12}><p className="text-muted">No se encontraron recetas.</p></Col>
             )}
          </Row>
        </Container>
      )}

    </div> 
  );
}
