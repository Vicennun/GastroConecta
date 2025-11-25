// src/components/RatingDisplay.jsx

import React, { useState, useMemo } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MAX_STARS = 5;

// Componente auxiliar para mostrar las estrellas (solo lectura)
function StarDisplay({ rating, count, size = '1rem' }) {
    // Convierte el rating (ej. 4.5) en una cadena de estrellas.
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(MAX_STARS - Math.ceil(rating));

    const color = rating >= 4 ? 'text-success' : rating >= 3 ? 'text-warning' : 'text-danger';

    return (
        <span className="d-flex align-items-center">
            <span style={{ fontSize: size }} className={`me-2 ${color}`}>
                {fullStars}{emptyStars}
            </span>
            <small className="text-muted">
                ({rating > 0 ? rating.toFixed(1) : 'Sin calificación'} / {count} votos)
            </small>
        </span>
    );
}


// Componente principal para permitir al usuario calificar
export default function RatingDisplay({ receta }) {
    const { usuarioActual, submitRating, calculateAverageRating } = useAuth();
    
    // Obtener la calificación promedio y el número de votos
    const averageRating = useMemo(() => calculateAverageRating(receta.ratings), [receta.ratings, calculateAverageRating]);
    const totalVotes = receta.ratings ? receta.ratings.length : 0;
    
    // Determinar si el usuario ya ha votado y cuál fue su voto
    const existingRating = usuarioActual 
        ? (receta.ratings || []).find(r => r.userId === usuarioActual.id) 
        : null;
    
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(existingRating ? existingRating.score : 0);
    const [error, setError] = useState('');

    const handleRatingClick = (newScore) => {
        if (!usuarioActual) return;
        
        setError('');
        // Almacenar el rating temporalmente en el estado local y enviarlo al contexto
        setRating(newScore);
        submitRating(receta.id, newScore);
    };
    
    // Si el usuario es el autor, no puede calificar su propia receta
    const isAuthor = usuarioActual && usuarioActual.id === receta.autorId;

    return (
        <div className="mb-4">
            
            <h4 className="mb-2">Calificación</h4>
            
            {/* Mostrar Rating Promedio */}
            <StarDisplay rating={averageRating} count={totalVotes} size="1.25rem" />

            {/* Bloque de Calificación del Usuario */}
            <div className="mt-3 p-3 border rounded">
                <p className="fw-bold mb-2">Tu voto:</p>
                {/* 1. Usuario no logueado */}
                {!usuarioActual && (
                    <Alert variant="secondary" className="mb-0">
                        <Link to="/login">Inicia sesión</Link> para calificar.
                    </Alert>
                )}
                {/* 2. Usuario es el autor */}
                {isAuthor && (
                    <Alert variant="info" className="mb-0">
                        No puedes calificar tu propia receta.
                    </Alert>
                )}
                {/* 3. Usuario puede calificar */}
                {usuarioActual && !isAuthor && (
                    <div style={{ cursor: 'pointer', fontSize: '1.5rem' }}>
                        {[...Array(MAX_STARS)].map((_, index) => {
                            const scoreValue = index + 1;
                            return (
                                <span
                                    key={index}
                                    className={(hover || rating) >= scoreValue ? 'text-warning' : 'text-secondary'}
                                    onClick={() => handleRatingClick(scoreValue)}
                                    onMouseEnter={() => setHover(scoreValue)}
                                    onMouseLeave={() => setHover(0)}
                                    style={{ transition: 'color 0.1s' }}
                                >
                                    {scoreValue <= (hover || rating) ? '★' : '☆'}
                                </span>
                            );
                        })}
                        <span className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                            {rating > 0 ? `(${rating}/5)` : '(Haz clic para votar)'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Exportamos también StarDisplay para reusarlo en RecetaCard
export { StarDisplay };