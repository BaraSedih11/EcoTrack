const express = require('express');
const externalAPIsController = require('../controllers/external-APIsController');
const { authenticateUser } = require('../middlewares/authenticateUser');

const router = express.Router();

router.get(
  '/news/:topic',
  authenticateUser,
  externalAPIsController.getNewsByTopic,
);
router.get('/news', authenticateUser, externalAPIsController.getNews);

module.exports = router;
