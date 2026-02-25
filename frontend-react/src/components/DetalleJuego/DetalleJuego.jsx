import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { juegoService } from '../../services/juegoService';
import './DetalleJuego.css';

const DetalleJuego = () => {
  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [mostrarImagenPorDefecto, setMostrarImagenPorDefecto] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    cargarJuego();
  }, [id]);

  const cargarJuego = async () => {
    setCargando(true);
    setError('');

    try {
      const data = await juegoService.obtenerJuegoPorId(id);
      setJuego(data);
    } catch (err) {
      setError('Error al cargar el juego: ' + (err.mensaje || err.message));
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImagenError = () => {
    setMostrarImagenPorDefecto(true);
  };

  const editarJuego = () => {
    navigate(`/editar/${juego._id}`);
  };

  const volver = () => {
    navigate('/lista');
  };

  if (cargando) {
    return (
      <div className="container my-5">
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando detalle del juego...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!juego) {
    return (
      <div className="container my-5">
        <div className="alert alert-info">No se encontró el juego solicitado.</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            {/* Imagen */}
            <div
              className="card-img-top position-relative"
              style={{
                height: '300px',
                overflow: 'hidden',
                background: '#f0f0f0'
              }}
            >
              {!mostrarImagenPorDefecto && juego.imagen && juego.imagen.trim() !== '' ? (
                <img
                  src={juego.imagen}
                  alt={juego.titulo}
                  className="w-100 h-100"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  onError={handleImagenError}
                />
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#6c757d'
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>🎮</span>
                </div>
              )}
            </div>

            <div className="card-body">
              {/* Título */}
              <h1 className="card-title mb-2">{juego.titulo}</h1>

              {/* Badges de estado */}
              <div className="mb-3">
                {(() => {
                const estaCompletado = juego.completado || juego.porcentajeCompletado === 100;
                return estaCompletado ? (
                  <span className="badge bg-success me-2">✅ Completado</span>
                ) : (
                  <span className="badge bg-warning text-dark me-2">⏳ En progreso</span>
                );
              })()}
                <span className="badge bg-info">📅 {formatearFecha(juego.fechaLanzamiento)}</span>
              </div>

              {/* Descripción */}
              <p className="card-text text-muted mb-4">{juego.descripcion}</p>

              {/* Información detallada */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <h5 className="mb-3">📊 Información</h5>
                  <div className="info-item mb-3">
                    <strong>Horas jugadas:</strong>
                    <p className="mb-0">{juego.horasJugadas} horas</p>
                  </div>
                  <div className="info-item mb-3">
                    <strong>Progreso:</strong>
                    <p className="mb-0">{juego.porcentajeCompletado}%</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="mb-3">📈 Estadísticas</h5>
                  <div className="info-item mb-3">
                    <strong>Creado:</strong>
                    <p className="mb-0">{formatearFecha(juego.createdAt)}</p>
                  </div>
                  <div className="info-item mb-3">
                    <strong>Última actualización:</strong>
                    <p className="mb-0">{formatearFecha(juego.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mb-4">
                <h5 className="mb-2">Barra de Progreso</h5>
                <div className="progress" style={{ height: '30px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${juego.porcentajeCompletado}%` }}
                  >
                    <strong>{juego.porcentajeCompletado}%</strong>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-between">
                <button type="button" className="btn btn-secondary" onClick={volver}>
                  ← Volver a la lista
                </button>
                <button type="button" className="btn btn-primary" onClick={editarJuego}>
                  ✏️ Editar juego
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleJuego;
