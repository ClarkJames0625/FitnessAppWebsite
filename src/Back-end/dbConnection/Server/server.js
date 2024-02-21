//Static files
const express = require('express');
const path = require('path');
//body parser
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5500;
const frontEndPath = path.join(__dirname, '../', '../', '../', 'Front-end');

// Serve static files from the 'Front-end' directory
app.use(express.static(frontEndPath));
//parse request body
app.use(bodyParser.json());
//app.use(express.json())

// Define a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'Login', 'index.html'));
});

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

// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});


app.post('/login', (req, res) => {
  const {username, password} = req.body

  validateLogin(username, password, (isValidLogin) => {
    if (isValidLogin) {
      console.log("true returned");
      res.status(200).json({message: 'User login successful', redirectTo: '/MainMenu/mainMenu.html' })
    } else {
      console.log("False returned");
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

//Login query
function validateLogin(username, password, callback) {
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
      callback(false);
    } else {
      // Return true if user is found
      callback(results.length > 0);
    }
  });
}

//newUser API
app.post('/newUser', (req, res) => {
  const { username, password, email } = req.body;
  try{
    newUser(username, password, email);
    res.status(200);
  } catch(error){
    res.status(400).json({error});
  }

}),

//create new user
function newUser(username, password, email, callback) {
  const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?);";
  
  connection.query(query, [username, password, email], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
      callback(false);
    }
    else {
      console.log(results);
      callback(false);
    }
  })
}