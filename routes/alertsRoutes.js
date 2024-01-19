const express = require('express');
const alertsController = require('../controllers/alertsController');
const router = express.Router();

router.post('/addAlert', alertsController.addAlerts);
router.put('/updateAlert', alertsController.updateAlerts);
router.delete('/deleteAlert', alertsController.deleteAlerts);
module.exports = router;
