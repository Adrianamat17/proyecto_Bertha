require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// Variable para controlar el estado de la conexión
let isConnected = false;

// Handler para Vercel (serverless)
module.exports = async (req, res) => {
  try {
    // Conectar a MongoDB si no está conectado
    if (!isConnected) {
      console.log('🚀 Inicializando conexión...');
      await connectDB();
      isConnected = true;
      console.log('✅ Conexión lista');
    }
    
    return app(req, res);
  } catch (error) {
    console.error('💥 Error:', error.message);
    
    res.status(500).json({ 
      error: 'Error de conexión a la base de datos',
      message: error.message
    });
  }
};

// Solo para desarrollo local
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor local en http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('💥 Error:', err);
    process.exit(1);
  });
}