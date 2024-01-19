const mysql = require('mysql2');
const { notifyUser } = require('../../services/SocketService');
let alertsMap = {};

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack',
});
class NotificationRepo{
    createNotification(UserID, NotType, message, timestamp,Viewed) {
        
        try {
	db.query(
	          'INSERT INTO Notifications (UserID, NotType, message, timestamp,Viewed) VALUES (?, ?, ?, ?,?)',
	          [UserID, NotType, message, timestamp,Viewed],
	          (insertError) => {
	            if (insertError) {
	              console.log(insertError);
	            }
	          },
	        );
} catch (condition){

}
        
      }
}
module.exports=NotificationRepo;