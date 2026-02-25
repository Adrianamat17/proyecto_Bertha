import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ListaJuegos from './components/ListaJuegos/ListaJuegos';
import DetalleJuego from './components/DetalleJuego/DetalleJuego';
import FormularioJuego from './components/FormularioJuego/FormularioJuego';
import './App.css';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-dark bg-dark" style={{ position: 'sticky', top: 0, zIndex: 1020 }}>
      <div className="container-fluid">
        <button
          className="navbar-brand"
          onClick={() => navigate('/lista')}
          style={{ border: 'none', background: 'none', cursor: 'pointer' }}
        >
          <span className="fs-4">🎮 GameVault</span>
        </button>
        <span className="navbar-text text-light">Gestor de Videojuegos</span>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-4 mt-5">
      <p className="mb-1">&copy; 2026 GameVault - Fase 3 Frontend React</p>
      <p className="mb-0">Conectando con API Backend en puerto 3000</p>
    </footer>
  );
};

const AppContent = () => {
  return (
    <>
      <NavBar />
      <main className="py-4">
        <Routes>
          <Route path="/" element={<ListaJuegos />} />
          <Route path="/lista" element={<ListaJuegos />} />
          <Route path="/crear" element={<FormularioJuego />} />
          <Route path="/editar/:id" element={<FormularioJuego />} />
          <Route path="/detalle/:id" element={<DetalleJuego />} />
          <Route path="*" element={<ListaJuegos />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
