require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Variable para controlar el estado de la conexión
let connectionPromise = null;

// Handler principal para Vercel
module.exports = async (req, res) => {
  // Configurar headers para evitar cacheo
  res.setHeader('Cache-Control', 'no-store');
  
  // Registrar la petición
  console.log(`📨 ${req.method} ${req.url}`);

  try {
    // Conectar a MongoDB si no hay conexión activa
    if (!connectionPromise) {
      console.log('🚀 Inicializando conexión a MongoDB para Vercel...');
      connectionPromise = connectDB();
    }

    // Esperar a que la conexión se establezca
    await connectionPromise;
    console.log('✅ Conexión lista, procesando petición...');

    // Ejecutar la aplicación Express
    return app(req, res);
  } catch (error) {
    console.error('💥 Error crítico en handler:', error);
    
    // Si hay error de conexión, resetear para reintentar
    if (error.message.includes('Mongo') || error.message.includes('timed out')) {
      console.log('🔄 Resetando conexión por error...');
      connectionPromise = null;
    }
    
    // Responder con error
    res.status(500).json({ 
      error: 'Error de conexión a la base de datos',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Solo para desarrollo local
if (require.main === module) {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Servidor local en http://localhost:${PORT}`);
        console.log(`📚 Conectado a MongoDB Atlas`);
        console.log(`⚙️ Entorno: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('💥 Error iniciando servidor local:', error);
      process.exit(1);
    }
  };
  
  startServer();
}