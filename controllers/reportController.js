const ReportModel = require('../models/reportModel');

const ReportController = {
  createReport: async (req, res) => {
    const { userID, reportType, description, status } = req.body;

    try {
      const insertedId = await ReportModel.createReport(
        userID,
        reportType,
        description,
        status,
      );
      res
        .status(201)
        .json({ message: 'Report created successfully', reportID: insertedId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllReports: async (req, res) => {
    try {
      const reports = await ReportModel.getAllReports();
      res.status(200).json({ reports });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteReport: async (req, res) => {
    const { reportID } = req.params;

    try {
      const rowsAffected = await ReportModel.deleteReport(reportID);

      if (rowsAffected > 0) {
        res.status(200).json({ message: 'Report deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Report not found.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ReportController;
