const DataRepository = require('../data/database/DataRepository');
const AlertRepository = require('../data/database/AlertRepository');
const dataRepository = new DataRepository();
const alertRepo = new AlertRepository();
exports.submitData = async (req, res) => {
  try {
    const message = await dataRepository.submitData(req, res);
    const s = await alertRepo.checkAlerts(req, res);

    res.status(201).json({ message });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

exports.uploadData = (req, res) => {
  dataRepository.getData(req, res);
};
