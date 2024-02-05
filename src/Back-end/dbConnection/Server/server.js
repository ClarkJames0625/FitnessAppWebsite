//Static files
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5500;
const frontEndPath = path.join(__dirname, '../', '../', '../', 'Front-end');

// Serve static files from the 'Front-end' directory
app.use(express.static(frontEndPath));
//app.use(express.json())

// Define a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'Login', 'index.html'));
});

// app.get('/Back-end/dbConnection/Server/server.js', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dbConnection', 'Server', 'server.js'));
// });
// Define more routes and middleware as needed

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//-------------------------------------DATABASE CONNECTION & FUNCTIONS---------------------------------
const mysql = require('mysql2');

// create a new MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "Jclark69!*",//put into a const file dont leave hardcoded
  database: "seniorProject" //put into const file dont leave hardcoded
});

app.post('/hello', async (req, res) => {
  const {username, password} = req.body

  try{
    validateLogin(username, password)
    res.status(200)
  } catch(error){
    res.status(400).json({error})
  }

})

// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});

function validateLogin(username, password) {
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
    } else {
      // results will contain matching user information
      console.log(results)
    }
  });
}

//exported functions
module.exports  = { 
    validateLogin 
};

// close the MySQL connection
connection.end();



