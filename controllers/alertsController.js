const AlertRepository = require('../data/database/AlertRepository');

const alertRepository = new AlertRepository();
exports.addAlerts = (req, res) => alertRepository.createAlert(req, res);
exports.updateAlerts = (req, res) => alertRepository.updateAlert(req, res);
exports.deleteAlerts = (req, res) => alertRepository.deleteAlert(req, res);
