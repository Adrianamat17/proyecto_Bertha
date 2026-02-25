import axios from 'axios';

// Vite exposes variables prefixed with VITE_ via import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/games';

export const juegoService = {
  // Obtener todos los juegos con paginación
  obtenerJuegos: async (page = 1, limit = 10, completado, titulo) => {
    try {
      const params = { page, limit };
      if (completado !== undefined) {
        // valor booleano viene desde el componente
        params.completado = completado;
      }
      if (titulo) {
        params.titulo = titulo;
      }
      const response = await axios.get(`${API_URL}/get/all`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener un juego por ID
  obtenerJuegoPorId: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear un nuevo juego
  crearJuego: async (juego) => {
    try {
      const response = await axios.post(`${API_URL}/post`, juego);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar un juego (PATCH)
  actualizarJuego: async (id, juego) => {
    try {
      const response = await axios.patch(`${API_URL}/update/${id}`, juego);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reemplazar un juego (PUT)
  reemplazarJuego: async (id, juego) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, juego);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar un juego
  eliminarJuego: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
