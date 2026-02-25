const mongoose = require('mongoose');

// Variable global para cachear la conexión (IMPORTANTE para serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // Si ya hay conexión activa, la reutilizamos
  if (cached.conn) {
    console.log('✅ Usando conexión cacheada a MongoDB');
    return cached.conn;
  }

  // Si no hay promesa de conexión en curso, la creamos
  if (!cached.promise) {
    const opts = {
  bufferCommands: true,
  bufferTimeoutMS: 30000,      
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 60000,
  retryWrites: true,
  retryReads: true,
  heartbeatFrequencyMS: 10000,
};

    console.log('🔄 Conectando a MongoDB Atlas...');
    console.log('📌 URI:', process.env.MONGODB_URI ? '✓ Definida' : '✗ No definida');
    
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB conectado exitosamente');
        console.log('📊 Base de datos:', mongoose.connection.name);
        console.log('🖥️ Host:', mongoose.connection.host);
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ Error conectando a MongoDB:');
        console.error('📋 Mensaje:', error.message);
        console.error('🔧 Código:', error.code);
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

// Eventos de conexión para debugging
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Error en conexión Mongoose:', err);
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚪ Mongoose desconectado');
  cached.conn = null;
  cached.promise = null;
});

// Para manejar el cierre ordenado en desarrollo local
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔚 Conexión MongoDB cerrada por terminación de la app');
  process.exit(0);
});

module.exports = connectDB;