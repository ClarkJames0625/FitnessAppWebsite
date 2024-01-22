const mysql = require('mysql2');


// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "Jclark69!*",//put into a const file dont leave hardcoded
  database: "seniorProject" //put into const file dont leave hardcoded
});
// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    
    console.log('Connected to MySQL database!');
  }
});

function validateLogin(username, password, callback) {
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
      callback(error, null);
    } else {
      // results will contain matching user information
      callback(null, results);
    }
  });
}

//exported functions
module.exports  = { validateLogin };

// close the MySQL connection
connection.end();