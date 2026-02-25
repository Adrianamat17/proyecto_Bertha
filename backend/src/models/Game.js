const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      unique: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    horasJugadas: {
      type: Number,
      default: 0,
      min: [0, 'Las horas jugadas no pueden ser negativas'],
      max: [100000, 'Las horas jugadas parecen poco realistas'],
    },
    fechaLanzamiento: {
      type: Date,
    },
    completado: {
      type: Boolean,
      default: false,
    },
    porcentajeCompletado: {
      type: Number,
      min: [0, 'El porcentaje no puede ser menor que 0'],
      max: [100, 'El porcentaje no puede exceder 100'],
      default: 0,
    },
    imagen: {
      type: String,
    },
  },
  { timestamps: true }
);

// sincroniza el flag "completado" con el porcentaje antes de guardar
gameSchema.pre('save', function (next) {
  if (this.porcentajeCompletado >= 100) {
    this.completado = true;
  } else {
    this.completado = false;
  }
  next();
});

module.exports = mongoose.model('Game', gameSchema);