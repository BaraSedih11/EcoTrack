const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authenticateUser } = require('../middlewares/authenticateUser');

router.post('/', authenticateUser, ReportController.createReport);
router.get('/', authenticateUser, ReportController.getAllReports);
router.delete('/:reportID', authenticateUser, ReportController.deleteReport);

module.exports = router;
