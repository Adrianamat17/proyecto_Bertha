const express = require('express');
require('express-async-errors');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/v1/games', gameRoutes);

// health check
app.get('/', (req, res) => res.json({ status: 'ok' }));

// error handler
app.use(errorHandler);

module.exports = app;