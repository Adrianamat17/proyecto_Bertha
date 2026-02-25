const Game = require('../models/Game');

// ayudante para paginación
const getPagination = (page, limit) => {
  const parsedPage = parseInt(page, 10) || 1;
  // Allow 0 to mean "no limit". If limit is omitted or invalid default to 10.
  const parsedLimitRaw = parseInt(limit, 10);
  const parsedLimit = Number.isNaN(parsedLimitRaw) ? 10 : parsedLimitRaw;
  const skip = (parsedPage - 1) * (parsedLimit > 0 ? parsedLimit : 0);
  return { skip, limit: parsedLimit };
};

exports.getAllGames = async (req, res, next) => {
  const { page, limit, completado, titulo, q } = req.query;
  const { skip, limit: lim } = getPagination(page, limit);
  try {
    const filter = {};
    if (completado !== undefined) {
      // esperamos "true" o "false" como string
      filter.completado = completado === 'true';
    }
    // búsqueda por título/descripcion (case-insensitive)
    const search = titulo || q;
    if (search) {
      const re = new RegExp(search, 'i');
      filter.$or = [{ titulo: re }, { descripcion: re }];
    }
    let query = Game.find(filter).skip(skip);
    if (lim > 0) {
      query = query.limit(lim);
    }
    const games = await query.exec();
    const total = await Game.countDocuments(filter);
    res.status(200).json({ total, page: page || 1, limit: lim, datos: games });
  } catch (err) {
    next(err);
  }
};

exports.getGameById = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    res.status(200).json(game);
  } catch (err) {
    next(err);
  }
};

exports.createGame = async (req, res, next) => {
  try {
    // regla de negocio: no duplicados (case-insensitive)
    const existing = await Game.findOne({ titulo: new RegExp(`^${req.body.titulo}$`, 'i') });
    if (existing) {
      return res.status(400).json({ mensaje: 'Ya existe un juego con este título' });
    }
    // si el porcentaje enviado alcanza o supera 100, marcamos completado
    if (req.body.porcentajeCompletado >= 100) {
      req.body.completado = true;
    }
    const game = new Game(req.body);
    const saved = await game.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    // si el porcentaje que llega es 100 o más, forzamos el flag completado
    if (req.body.porcentajeCompletado >= 100) {
      req.body.completado = true;
    }
    Object.assign(game, req.body);
    const updated = await game.save();
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.replaceGame = async (req, res, next) => {
  try {
    const updated = await Game.findOneAndReplace({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }
    // regla de negocio: no se puede eliminar un juego completado
    if (game.completado) {
      return res.status(400).json({ mensaje: 'No se puede eliminar un juego completado' });
    }
    await Game.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensaje: 'Juego eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
};