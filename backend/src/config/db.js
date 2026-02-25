const mongoose = require('mongoose');

// Variable global para cachear la conexión (IMPORTANTE para serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Si ya hay conexión activa, la reutilizamos
  if (cached.conn) {
    console.log('✅ Usando conexión cacheada');
    return cached.conn;
  }

  // Si no hay promesa de conexión en curso, la creamos
  if (!cached.promise) {
    console.log('🔄 Conectando a MongoDB Atlas...');
    
    // CONFIGURACIÓN MÍNIMA - Solo lo esencial
    cached.promise = mongoose.connect(process.env.MONGODB_URI)
      .then((mongoose) => {
        console.log('✅ MongoDB conectado exitosamente');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ Error conectando a MongoDB:', error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;