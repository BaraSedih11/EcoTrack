const DataRepository = require('../data/database/DataRepository');
const dataRepository = new DataRepository();

exports.searchOpenData = async (req, res) => {
  dataRepository.searchOpenData(req, res);
};

exports.searchOpenDataByAccessId = (req, res) => {
  dataRepository.searchOpenDataByAccessId(req, res);
};

exports.performAnalysis = async (req, res) => {
  dataRepository.performAnalysis(req, res);
};

exports.performAnalysisbyDataType = async (req, res) => {
  dataRepository.performAnalysisbyDataType(req, res);
};

exports.submitAnalysis = (req, res) => {
  dataRepository
    .submitAnalysis(req, res)
    .then((message) => {
      res.status(201).json({ message });
    })
    .catch((error) => {
      res.status(400).json({ message: error });
    });
};
