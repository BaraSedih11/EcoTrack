const mysql = require('mysql2');
const { notifyUser } = require('../../services/SocketService');
let alertsMap = {};
const NotificationRepo = require('../database/NotificationRepo');
const notRepo = new NotificationRepo();
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});
class AlertRepository {
  constructor() {
    this.getAllAlerts();
  }
  allAlerts = [];
  getAllAlerts() {
    db.query('SELECT * FROM alalerts', (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Internal server error.' });
      }

      let a = [];
      for (let i of results) {
        a.push(i);
        if (!alertsMap.hasOwnProperty(i['UserID'])) {
          alertsMap[i['UserID']] = [];
        }
        let alertss = alertsMap[i['UserID']];
        alertss.push(i);
        alertsMap[i['UserID']] = alertss;
      }
      this.allAlerts = results;

      return a;
    });
  }
  async checkAlerts(req, res) {
    let allAler = this.getAllAlerts();
    const { DataType, DataValue } = req.body;

    for (let i of this.allAlerts) {
      if (i['AlertType'] === DataType) {
        if (i['AlertThresholds'] <= DataValue) {
          notRepo.createNotification(
            i['UserID'],
            'Alert',
            `${DataType} has exceeded the limit ${i['AlertThresholds']},\n and the Value now is ${DataValue}`,
            new Date(),
            0,
          );
          notifyUser(
            i['UserID'],
            `${DataType} has exceeded the limit ${i['AlertThresholds']},\n and the Value now is ${DataValue}`,
          );
        }
      }
    }
  }
  createAlert(req, res) {
    const { AlertThresholds, AlertType, AlertName, UserID } = req.body;
    db.query(
      'INSERT INTO alalerts (UserID, AlertName, AlertType, AlertThresholds) VALUES (?, ?, ?, ?)',
      [UserID, AlertName, AlertType, AlertThresholds],
      (insertError) => {
        if (insertError) {
          console.log(insertError);
        }
      },
    );
    this.getAllAlerts();
    return res.status(200).json({ message: 'Alert added successfully.' });
  }

  updateAlert(req, res) {
    const { AlertID, AlertThresholds, AlertType, AlertName } = req.body;
    db.query(
      'UPDATE alalerts SET AlertName = ?, AlertType = ?, AlertThresholds = ? WHERE AlertID = ?',
      [AlertName, AlertType, AlertThresholds, AlertID],
      (updateError) => {
        if (updateError) {
          console.log(updateError);
          return res.status(500).json({ error: 'Failed to update alert' });
        }
        this.getAllAlerts();
        return res.status(200).json({ message: 'Alert updated successfully.' });
      },
    );
  }

  deleteAlert(req, res) {
    const { AlertID } = req.body;
    db.query(
      'DELETE FROM alalerts WHERE AlertID = ?',
      [AlertID],
      (deleteError) => {
        if (deleteError) {
          console.log(deleteError);
          return res.status(500).json({ error: 'Failed to delete alert' });
        }
        this.getAllAlerts(); // Refresh the alerts after deletion if needed
        return res.status(200).json({ message: 'Alert deleted successfully.' });
      },
    );
  }
}
module.exports = AlertRepository;
