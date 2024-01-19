/* eslint-disable prefer-promise-reject-errors */
const ScoreRepository = require('./ScoreRepository');
const scoreRepository = new ScoreRepository();

const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
  /* host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,*/

  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

class DataRepository {
  submitData(req, res) {
    const { DataType, DataValue, Description, DataSource } = req.body;

    const userId = req.session.userId;

    return new Promise((resolve, reject) => {
      const timestamp = new Date();
      //const scoringMultiplier = 0.1;
      //const scoreIncrease = DataValue * scoringMultiplier;
      db.query(
        'INSERT INTO data (DataType, DataValue, Timestamp, UserID, DataSource, Location, Description) VALUES (?, ?, ?, ?, ?, ?,?)',
        [DataType, DataValue, timestamp, userId, DataSource, null, Description],
        (error, results) => {
          if (error) {
            console.error('Error inserting into the database:', error);
            const err = `Error inserting into the database: ${error.message}`;
            return reject(err);
          }

          scoreRepository.updateOrInsertDataScore(userId, DataValue, DataType);

          // Assuming you have some meaningful data to return, adjust as needed
          const responseData = {
            insertedId: results.insertId,
            message: 'Data submitted successfully.',
          };
          return resolve(responseData);
        },
      );
    });
  }

  getData(req, res) {
    const userId = req.session.userId;

    db.query(
      'SELECT DataType, DataValue, Timestamp FROM data WHERE userId = ?',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error querying data from the database:', error);
          const detailedError = `Error querying data from the database: ${error.message}`;
          return res.status(404).json({ message: detailedError });
        }

        if (results.length === 0) {
          return res.status(404).json({ message: 'Data not found.' });
        }

        const Data = results;
        return res.json({ data: Data });
      },
    );
  }
  //////////////  OPEN DATA to researcher and scientists
  submitAnalysis(req, res) {
    const { AccessLevel, DataType, AccessibleFields, DataID } = req.body;
    //const DataID = req.DataID;

    const userId = req.session.userId;
    if (!userId) {
      const unAuthError = 'researchers/scientists not authenticated.';
      console.error(unAuthError);
      return res.status(401).json({ message: unAuthError });
    }

    return new Promise((resolve, reject) => {
      const timestamp = new Date();
      const accessibleFieldsJson = JSON.stringify(AccessibleFields);
      db.query(
        'INSERT INTO opendata (AccessLevel, DataType, AccessibleFields, Timestamp, DataID) VALUES (?, ?, ?, ?, ?)',
        [AccessLevel, DataType, accessibleFieldsJson, timestamp, DataID],
        (error, results) => {
          if (error) {
            console.error('Error inserting into the database:', error);
            const err = `Error inserting into the database: ${error.message}`;
            return reject(err);
          }
          res.setHeader('Content-Type', 'application/json');
          return resolve('Data Analayized submitted successfully.');
        },
      );
    });
  }

  searchOpenData(req, res) {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    db.query('SELECT * FROM opendata ', (error, results) => {
      if (error) {
        console.error('Error querying data from the database:', error);
        const detailedError = `Error querying data from the database: ${error.message}`;
        return res.status(500).json({ message: detailedError });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Data not found.' });
      }

      const Data = results;
      return res.json({ data: Data });
    });
  }

  searchOpenDataByAccessId(req, res) {
    const { AccessId } = req.params;

    db.query(
      'SELECT * FROM opendata WHERE AccessID = ?',
      [AccessId],
      (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Internal server error.' });
        }
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid data.' });
        }
        return res.json({ Data: results });
      },
    );
  }

  executeQuery(query, errorMessage, callback) {
    db.query(query, (error, results) => {
      if (error) {
        console.error(`Error performing analysis (${errorMessage}):`, error);
        return callback({ error: 'Internal server error.' });
      }
      callback(null, results);
    });
  }
  /////////////////////////////////
  performAnalysisbyDataType(req, res) {
    try {
      const { DataType } = req.params;
      const query1 =
        'SELECT MAX(DataValue) AS max FROM data WHERE DataType =? ';
      const query2 =
        'SELECT MIN(DataValue) AS min FROM data WHERE DataType = ?';
      const query3 =
        'SELECT AVG(DataValue) AS average FROM data WHERE DataType =? ';
      const query4 =
        'SELECT COUNT(*) AS opendataRecordCount FROM opendata WHERE DataType = ? ';

      db.query(query1, [DataType], (error1, results1) => {
        if (error1) {
          console.error('Error performing analysis (Query 1):', error1);
          return res.status(500).json({ message: 'Internal server error.' });
        }

        db.query(query2, [DataType], (error2, results2) => {
          if (error2) {
            console.error('Error performing analysis (Query 2):', error2);
            return res.status(500).json({ message: 'Internal server error.' });
          }

          db.query(query3, [DataType], (error3, results3) => {
            if (error2) {
              console.error('Error performing analysis (Query 3):', error2);
              return res
                .status(500)
                .json({ message: 'Internal server error.' });
            }
            db.query(query4, [DataType], (error4, results4) => {
              if (error2) {
                console.error('Error performing analysis (Query 4):', error2);
                return res
                  .status(500)
                  .json({ message: 'Internal server error.' });
              }

              const maxData = results1[0].max;
              const minData = results2[0].min;
              const avg = results3[0].average;
              const opendata = results4[0].opendataRecordCount;
              return res.json({
                AnalysisResult: {
                  DataType: DataType,
                  Average: avg,
                  MaxDataValue: maxData,
                  MinDataValue: minData,
                  RecordCount: opendata,
                },
              });
            });
          });
        });
      });
    } catch (error) {
      console.error('Error performing analysis:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  performAnalysis = (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated.' });
      }

      const query =
        'SELECT DataType, MAX(DataValue) AS max, MIN(DataValue) AS min, AVG(DataValue) AS average, SUM(DataValue) AS totalDataValue FROM data GROUP BY DataType';

      db.query(query, (error, results) => {
        if (error) {
          console.error('Error performing analysis:', error);
          return res.status(500).json({ message: 'Internal server error.' });
        }

        const analysisResults = results.map((result) => ({
          DataType: result.DataType,
          MaxDataValue: result.max,
          MinDataValue: result.min,
          Average: result.average,
          TotalDataValue: result.totalDataValue,
        }));

        return res.json({ AnalysisResult: analysisResults });
      });
    } catch (error) {
      console.error('Error performing analysis:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  };
}

module.exports = DataRepository;
