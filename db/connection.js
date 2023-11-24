// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'employeemanager',
  password: 'SoccerCode36'
});

module.exports = connection