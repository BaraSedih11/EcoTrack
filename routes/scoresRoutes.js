const express = require('express');

const router = express.Router();
const scoresController = require('../controllers/scoresController');
const { authenticateUser } = require('../middlewares/authenticateUser');

router.get('/:userId', authenticateUser, scoresController.getUserScore);

module.exports = router;
