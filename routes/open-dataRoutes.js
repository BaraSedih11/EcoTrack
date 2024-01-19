const express = require('express');
const router = express.Router();
const openDataController = require('../controllers/open-dataController');
const {
  authenticateResearcher,
} = require('../middlewares/authenticateResearcher');

// for search
router.get(
  '/search',
  authenticateResearcher,
  openDataController.searchOpenData,
);
router.get(
  '/search/:AccessId',
  authenticateResearcher,
  openDataController.searchOpenDataByAccessId,
);

// for analysis retrive
router.get(
  '/analysis',
  authenticateResearcher,
  openDataController.performAnalysis,
);
router.get(
  '/analysis/:DataType',
  authenticateResearcher,
  openDataController.performAnalysisbyDataType,
);
//for analysis submit
router.post(
  '/submit-analysis',
  authenticateResearcher,
  openDataController.submitAnalysis,
);

module.exports = router;
