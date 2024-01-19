const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});

class ResourceRepository {
  getAllResources() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Resources', (error, results) => {
        if (error) {
          reject('Error fetching resources from the database.');
        } else {
          resolve(results);
        }
      });
    });
  }

  getResourceById(resourceId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM resources WHERE resourceId = ?',
        resourceId,
        (error, results) => {
          if (error) {
            reject('Error fetching resource from the database.');
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        },
      );
    });
  }

  createResource({ title, description, url, type, topic, author }) {
    return new Promise((resolve, reject) => {
      // Check if a resource with the same title already exists
      db.query(
        'SELECT * FROM Resources WHERE title = ?',
        [title],
        (checkError, checkResults) => {
          if (checkError) {
            reject('Error checking existing resource in the database.');
          } else if (checkResults.length > 0) {
            // A resource with the same title already exists
            reject('Resource with the same title already exists.');
          } else {
            // No existing resource with the same title, proceed with insertion
            db.query(
              'INSERT INTO Resources (title, description, url, type, topic, author) VALUES (?, ?, ?, ?, ?, ?)',
              [title, description, url, type, topic, author],
              (insertError, results) => {
                if (insertError) {
                  reject('Error creating resource in the database.');
                } else {
                  // Retrieve the newly created resource
                  db.query(
                    'SELECT * FROM Resources WHERE resourceId = ?',
                    [results.insertId],
                    (selectError, selectResults) => {
                      if (selectError) {
                        reject(
                          'Error fetching newly created resource from the database.',
                        );
                      } else {
                        const newResource =
                          selectResults.length > 0 ? selectResults[0] : null;
                        resolve(newResource);
                      }
                    },
                  );
                }
              },
            );
          }
        },
      );
    });
  }

  updateResource(resourceId, updatedFields) {
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE Resources SET ? WHERE resourceId = ?';
      db.query(
        updateQuery,
        [updatedFields, resourceId.resourceId],
        (error, results) => {
          if (error) {
            reject('Error updating resource in the database.');
          } else if (results.affectedRows === 0) {
            resolve(null); // No rows affected means the resource was not found
          } else {
            resolve({ resourceId, ...updatedFields });
          }
        },
      );
    });
  }

  deleteResource(resourceId) {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM Resources WHERE resourceId = ?',
        [resourceId.resourceId],
        (error, results) => {
          if (error) {
            reject('Error deleting resource from the database.');
          } else if (results.affectedRows === 0) {
            resolve(null); // No rows affected means the resource was not found
          } else {
            resolve({ resourceId });
          }
        },
      );
    });
  }

  filterResourcesByTopic(topic) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Resources WHERE topic = ?',
        [topic.topic],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        },
      );
    });
  }

  filterResourcesByType(type) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Resources WHERE type = ?',
        [type.type],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        },
      );
    });
  }
}

module.exports = ResourceRepository;
