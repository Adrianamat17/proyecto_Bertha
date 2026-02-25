const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  });

  // Errores de MongoDB
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(500).json({
      error: 'Error en la base de datos',
      message: err.message,
      code: err.code
    });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.errors
    });
  }

  // Error de Cast (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'ID inválido',
      message: 'El formato del ID no es válido'
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;