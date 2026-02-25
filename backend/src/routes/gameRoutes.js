const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameController');

// paginated get all
router.get('/get/all', controller.getAllGames);
router.get('/get/:id', controller.getGameById);
router.post('/post', controller.createGame);
router.patch('/update/:id', controller.updateGame);
router.put('/update/:id', controller.replaceGame);
router.delete('/delete/:id', controller.deleteGame);

module.exports = router;