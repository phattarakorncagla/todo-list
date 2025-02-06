const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'test1234',
  database: 'note_app'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;