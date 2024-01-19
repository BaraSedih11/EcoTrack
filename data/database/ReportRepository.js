const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

const ReportModel = {
  createReport: (userID, issue, description) => {
    return new Promise((resolve, reject) => {
      const query =
        'INSERT INTO environmental_reports (userID, issue, description) VALUES (?, ?, ?)';
      db.query(query, [userID, issue, description], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  },

  getAllReports: () => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM environmental_reports';
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  deleteReport: (reportID) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM environmental_reports WHERE ID = ?';
      db.query(query, [reportID], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result.affectedRows);
        }
      });
    });
  },
};

module.exports = ReportModel;
