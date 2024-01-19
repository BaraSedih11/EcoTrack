const express = require('express');
const dataController = require('../controllers/dataController');
const { authenticateUser } = require('../middlewares/authenticateUser');
const router = express.Router();

router.post('/submit', authenticateUser, dataController.submitData);
router.get('/dataSet', authenticateUser, dataController.uploadData);

module.exports = router;
