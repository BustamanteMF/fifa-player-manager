const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all player routes
router.use(authMiddleware);

// Route to get all players with optional filtering and pagination
router.get('/', playerController.getAllPlayers);
// Route to download players data (mover antes de /:id)
router.get('/download', playerController.downloadPlayers);
// Route to get player by id
router.get('/:id', playerController.getPlayerById);
// Route to update player data
router.put('/:id', playerController.updatePlayer);
// Route to create a new player
router.post('/', playerController.createPlayer);

module.exports = router;
