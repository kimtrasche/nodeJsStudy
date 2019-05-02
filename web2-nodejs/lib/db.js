var mysql = require('mysql');
var db = mysql.createConnection({
    host     : '192.168.56.1',
    user     : 'kt4u',
    password : 'kt4u0512',
    database : 'opentutorials'
});
db.connect();

module.exports = db;