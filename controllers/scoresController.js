const ScoreRepository = require('../data/database/ScoreRepository');
//const { validationResult, body } = require('express-validator');
const scoreRepository = new ScoreRepository();

exports.getUserScore = (req, res) => {
  scoreRepository.scoreOfUser(req, res);
};
