import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { juegoService } from '../../services/juegoService';
import './FormularioJuego.css';

const FormularioJuego = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    horasJugadas: 0,
    fechaLanzamiento: '',
    completado: false,
    porcentajeCompletado: 0,
    imagen: ''
  });

  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [exitoMensaje, setExitoMensaje] = useState('');
  const [editando, setEditando] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setEditando(true);
      cargarJuego();
    }
  }, [id]);

  const cargarJuego = async () => {
    setCargando(true);
    try {
      const juego = await juegoService.obtenerJuegoPorId(id);
      const fechaLanzamiento = juego.fechaLanzamiento
        ? new Date(juego.fechaLanzamiento).toISOString().split('T')[0]
        : '';

      // si el porcentaje viene en 100 también marcamos como completado para evitar discrepancias
      const completadoReal = juego.completado || juego.porcentajeCompletado === 100;

      setFormData({
        titulo: juego.titulo,
        descripcion: juego.descripcion,
        horasJugadas: juego.horasJugadas,
        fechaLanzamiento: fechaLanzamiento,
        completado: completadoReal,
        porcentajeCompletado: juego.porcentajeCompletado,
        imagen: juego.imagen || ''
      });
    } catch (err) {
      setError('Error al cargar el juego: ' + (err.mensaje || err.message));
    } finally {
      setCargando(false);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.titulo || formData.titulo.trim().length < 3) {
      nuevosErrores.titulo = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion || formData.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.fechaLanzamiento) {
      nuevosErrores.fechaLanzamiento = 'La fecha de lanzamiento es obligatoria';
    }

    if (formData.horasJugadas < 0 || formData.horasJugadas > 100000) {
      nuevosErrores.horasJugadas = 'Las horas deben estar entre 0 y 100000';
    }

    if (formData.porcentajeCompletado < 0 || formData.porcentajeCompletado > 100) {
      nuevosErrores.porcentajeCompletado = 'El porcentaje debe estar entre 0 y 100';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // when the percentage slider changes we also adjust the "completado" flag
    if (name === 'porcentajeCompletado') {
      const porcentaje = Number(value);
      setFormData(prev => ({
        ...prev,
        porcentajeCompletado: porcentaje,
        completado: porcentaje === 100
      }));
      return;
    }

    // when the user toggles the checkbox we may want to bump the percentage up to 100
    if (name === 'completado') {
      const checkedVal = checked;
      setFormData(prev => ({
        ...prev,
        completado: checkedVal,
        // if the box is checked make sure the progress is full, otherwise leave the existing value alone
        porcentajeCompletado: checkedVal ? 100 : prev.porcentajeCompletado
      }));
      return;
    }

    // default handler for other fields
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? checked
        : type === 'number'
          ? Number(value)
          : value
    }));
    if (name === 'imagen') {
      setPreviewError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCargando(true);
    setError('');
    setExitoMensaje('');

    try {
      if (editando) {
        await juegoService.actualizarJuego(id, formData);
        setExitoMensaje('Juego actualizado exitosamente');
      } else {
        await juegoService.crearJuego(formData);
        setExitoMensaje('Juego creado exitosamente');
      }

      setTimeout(() => navigate('/lista'), 2000);
    } catch (err) {
      setError('Error al guardar: ' + (err.mensaje || err.message));
    } finally {
      setCargando(false);
    }
  };

  const cancelar = () => {
    navigate('/lista');
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">
                {editando ? '✏️ Editar Juego' : '➕ Nuevo Juego'}
              </h2>
            </div>

            <div className="card-body">
              {/* Alertas */}
              {exitoMensaje && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {exitoMensaje}
                </div>
              )}

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
                  ></button>
                </div>
              )}

              {/* Loader */}
              {cargando && (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}

              {/* Formulario */}
              {!cargando && (
                <form onSubmit={handleSubmit}>
                  {/* Título */}
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">
                      Título del Juego *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errores.titulo ? 'is-invalid' : ''}`}
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      placeholder="Ej: The Legend of Zelda"
                    />
                    {errores.titulo && (
                      <div className="invalid-feedback">{errores.titulo}</div>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">
                      Descripción *
                    </label>
                    <textarea
                      className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                      id="descripcion"
                      name="descripcion"
                      rows="4"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Describe el juego..."
                    ></textarea>
                    {errores.descripcion && (
                      <div className="invalid-feedback">{errores.descripcion}</div>
                    )}
                  </div>

                  {/* Fecha de lanzamiento */}
                  <div className="mb-3">
                    <label htmlFor="fechaLanzamiento" className="form-label">
                      Fecha de Lanzamiento *
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errores.fechaLanzamiento ? 'is-invalid' : ''}`}
                      id="fechaLanzamiento"
                      name="fechaLanzamiento"
                      value={formData.fechaLanzamiento}
                      onChange={handleChange}
                    />
                    {errores.fechaLanzamiento && (
                      <div className="invalid-feedback">{errores.fechaLanzamiento}</div>
                    )}
                  </div>

                  {/* Horas Jugadas */}
                  <div className="mb-3">
                    <label htmlFor="horasJugadas" className="form-label">
                      Horas Jugadas *
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errores.horasJugadas ? 'is-invalid' : ''}`}
                      id="horasJugadas"
                      name="horasJugadas"
                      min="0"
                      max="100000"
                      value={formData.horasJugadas}
                      onChange={handleChange}
                    />
                    {errores.horasJugadas && (
                      <div className="invalid-feedback">{errores.horasJugadas}</div>
                    )}
                  </div>

                  {/* Porcentaje de completado */}
                  <div className="mb-3">
                    <label htmlFor="porcentaje" className="form-label">
                      Porcentaje de Completado: {formData.porcentajeCompletado}%
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      id="porcentaje"
                      name="porcentajeCompletado"
                      min="0"
                      max="100"
                      value={formData.porcentajeCompletado}
                      onChange={handleChange}
                    />
                    <div className="progress mt-2">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${formData.porcentajeCompletado}%` }}
                      ></div>
                    </div>
                    {formData.porcentajeCompletado !== 100 && (
                      <small className="text-muted text-danger">
                        El juego sólo puede completarse cuando el porcentaje llega a 100%.
                      </small>
                    )}
                  </div>

                  {/* Completado */}
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="completado"
                      name="completado"
                      checked={formData.completado}
                      onChange={handleChange}
                      disabled={formData.porcentajeCompletado !== 100}
                    />
                    <label className="form-check-label" htmlFor="completado">
                      ✅ Juego completado
                    </label>
                  </div>

                  {/* Imagen URL */}
                  <div className="mb-3">
                    <label htmlFor="imagen" className="form-label">
                      URL de la Imagen
                    </label>
                    <div className="d-flex align-items-center gap-3">
                      <input
                        type="url"
                        className="form-control"
                        id="imagen"
                        name="imagen"
                        value={formData.imagen}
                        onChange={handleChange}
                        placeholder="https://..."
                      />
                      <div style={{ width: 80, height: 80, border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden', background: '#f8f9fa' }}>
                        {formData.imagen ? (
                          <a href={formData.imagen} target="_blank" rel="noreferrer">
                            <img
                              src={formData.imagen}
                              alt="preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: previewError ? 'none' : 'block' }}
                              onError={() => setPreviewError(true)}
                            />
                          </a>
                        ) : (
                          <div className="text-center text-muted" style={{ fontSize: 12, paddingTop: 26 }}>Previsual.</div>
                        )}
                        {previewError && (
                          <div className="text-center text-muted" style={{ fontSize: 10, padding: 6 }}>URL inválida</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button type="button" className="btn btn-secondary" onClick={cancelar}>
                      ❌ Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={cargando}>
                      💾 {editando ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioJuego;
