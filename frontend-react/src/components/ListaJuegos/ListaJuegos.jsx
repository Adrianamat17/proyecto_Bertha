import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { juegoService } from '../../services/juegoService';
import './ListaJuegos.css';

const ListaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exitoMensaje, setExitoMensaje] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCompletado, setFiltroCompletado] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    cargarJuegos();
  }, [paginaActual]);

  const cargarJuegos = async (filtroOverride, searchOverride) => {
    setCargando(true);
    setError('');
    setExitoMensaje('');

    try {
      const currentFiltro = filtroOverride ?? filtroCompletado;
      const filtro = currentFiltro === 'completados' ? true : undefined;
      // si está filtrado hacemos petición sin límite para traer todos
      const limit = currentFiltro === 'todos' ? itemsPorPagina : 0;
      const page = currentFiltro === 'todos' ? paginaActual : 1;
      const currentSearch = (searchOverride !== undefined) ? searchOverride : busqueda;
      const response = await juegoService.obtenerJuegos(page, limit, filtro, currentSearch);
      let lista = (response.datos || []).map(j => ({
        ...j,
        completado: j.completado || j.porcentajeCompletado === 100
      }));
      if (currentFiltro === 'completados') {
        lista = lista.filter(j => j.completado);
      } else if (currentFiltro === 'incompletos') {
        lista = lista.filter(j => !j.completado);
      }
      lista.sort((a, b) => b.porcentajeCompletado - a.porcentajeCompletado);
      setJuegos(lista);
      // totalItems proviene del servidor cuando paginamos, pero si descargamos todos lo ajustamos manualmente
      setTotalItems(currentFiltro === 'todos' ? (response.total || 0) : lista.length);
      // si estamos filtrando dejamos siempre pagina 1
      if (currentFiltro !== 'todos') {
        setPaginaActual(1);
      }
    } catch (err) {
      setError('Error al cargar los juegos: ' + (err.mensaje || err.message));
    } finally {
      setCargando(false);
    }
  };


  const buscar = () => {
    if (busqueda.trim() === '') {
      cargarJuegos(undefined, '');
      return;
    }
    // búsqueda se hace en el servidor paginado por ahora
    cargarJuegos(undefined, busqueda);
  };

  const aplicarFiltro = () => {
    setPaginaActual(1);
    cargarJuegos();
  };

  const verDetalle = (id) => {
    navigate(`/detalle/${id}`);
  };

  const editarJuego = (id) => {
    navigate(`/editar/${id}`);
  };

  const eliminarJuego = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este juego?')) {
      setCargando(true);
      try {
        await juegoService.eliminarJuego(id);
        setExitoMensaje('Juego eliminado exitosamente');
        cargarJuegos();
        setTimeout(() => setExitoMensaje(''), 3000);
      } catch (err) {
        setError('Error al eliminar: ' + (err.mensaje || err.message));
      } finally {
        setCargando(false);
      }
    }
  };

  const crearNuevo = () => {
    navigate('/crear');
  };

  const irPagina = (pagina) => {
    if (pagina >= 1 && pagina <= Math.ceil(totalItems / itemsPorPagina)) {
      setPaginaActual(pagina);
    }
  };

  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

  return (
    <div className="container-fluid my-5">
      <div className="row">
        <div className="col-md-12">
          <h1 className="mb-4">🎮 Mis Juegos</h1>

          {/* Alertas */}
          {exitoMensaje && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {exitoMensaje}
              <button
                type="button"
                className="btn-close"
                onClick={() => setExitoMensaje('')}
              ></button>
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

          {/* Barra de búsqueda y filtros */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar por título..."
                      value={busqueda}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBusqueda(val);
                        if (val.trim() === '') {
                          // limpiar filtro inmediatamente
                          cargarJuegos();
                        }
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && buscar()}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={buscar}
                    >
                      🔍 Buscar
                    </button>
                  </div>
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button
                    className={`btn btn-outline-primary ${filtroCompletado === 'completados' ? 'active' : ''}`}
                    onClick={() => {
                      setFiltroCompletado('completados');
                      setPaginaActual(1);
                      cargarJuegos('completados');
                    }}
                  >
                    ✅ Completados
                  </button>
                  <button
                    className={`btn btn-outline-secondary ${filtroCompletado === 'todos' ? 'active' : ''}`}
                    onClick={() => {
                      setFiltroCompletado('todos');
                      setPaginaActual(1);
                      cargarJuegos('todos');
                    }}
                  >
                    🔄 Todos
                  </button>
                </div>
                <div className="col-md-2 text-end">
                  <button className="btn btn-success" onClick={crearNuevo}>
                    ➕ Nuevo Juego
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loader */}
          {cargando && (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando juegos...</p>
            </div>
          )}

          {/* Tabla */}
          {!cargando && (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Horas Jugadas</th>
                    <th>Progreso</th>
                    <th>Completado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {juegos.length > 0 ? (
                    juegos.map((juego) => (
                      <tr key={juego._id}>
                        <td>
                          <strong>{juego.titulo}</strong>
                        </td>
                        <td>{juego.descripcion?.slice(0, 50)}...</td>
                        <td>{juego.horasJugadas} h</td>
                        <td>
                          <div className="progress" style={{ height: '25px' }}>
                            <div
                              className="progress-bar bg-info"
                              role="progressbar"
                              style={{ width: `${juego.porcentajeCompletado}%` }}
                            >
                              {juego.porcentajeCompletado}%
                            </div>
                          </div>
                        </td>
                        <td>
                          {(() => {
                            const estaCompletado = juego.completado || juego.porcentajeCompletado === 100;
                            return estaCompletado ? (
                              <span className="badge bg-success">✅ Sí</span>
                            ) : (
                              <span className="badge bg-warning">⏳ No</span>
                            );
                          })()}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-1"
                            onClick={() => verDetalle(juego._id)}
                            title="Ver detalle"
                          >
                            👁️
                          </button>
                          <button
                            className="btn btn-sm btn-warning me-1"
                            onClick={() => editarJuego(juego._id)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => eliminarJuego(juego._id)}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No hay juegos para mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {(filtroCompletado === 'todos' && totalPaginas > 1) && (
            <nav aria-label="Paginación">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => irPagina(1)}>
                    Primera
                  </button>
                </li>
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => irPagina(paginaActual - 1)}>
                    Anterior
                  </button>
                </li>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                  <li
                    key={pagina}
                    className={`page-item ${pagina === paginaActual ? 'active' : ''}`}
                  >
                    <button className="page-link" onClick={() => irPagina(pagina)}>
                      {pagina}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => irPagina(paginaActual + 1)}>
                    Siguiente
                  </button>
                </li>
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => irPagina(totalPaginas)}>
                    Última
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaJuegos;
