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

//----------------------Users page logic----------------------------------
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  validateLogin(username, password, (userDetails) => {
    if (userDetails) {
      res.status(200).json({
        message: 'User login successful', 
        redirectTo: `/MainMenu/mainMenu.html?uID=${userDetails.uID}`
      });
    } else {
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
      callback(results.length > 0 ? results[0]: null);
    }
  });
}

//create new user
function newUser(username, password, email, callback) {
  const query = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  
  connection.query(query, [username, password, email], (error, results) => {
    if (error) {
      console.log("False returned");
      console.error('Error executing login query:', error);
      callback(false);
    }
    else {
      console.log("True returned");
      console.log(results);
      callback(true);
    }
  })
}

app.post('/changePassword', (req, res) => {
  const {newPassword, username} = req.body;
  console.log(req.body);

  console.log(newPassword, username);

  changePassword(newPassword, username, (changedPasswordDetails) => {
    if(changedPasswordDetails){
      res.status(200).json({
        message: 'Password updated',
        redirectTo: '/'
      })
    } else {
      res.status(401).json({error: 'Unable to updated user password'});
    }
  })

})

function changePassword(newPassword, username, callback) {
  const query = "UPDATE users SET password = ? WHERE username = ?";
  
  connection.query(query, [newPassword, username], (error, results) => {
    if (error) {
      console.log(newPassword, username);
      console.error('Error executing login query:', error);
      callback(false);
    }
    else {
      console.log(results);
      callback(true);
    }
  })
}

//newUser API
app.post('/newUser', (req, res) => {
  const { username, password, email } = req.body;

    newUser(username, password, email, (newUserDetails) => {
      console.log(newUserDetails)
      if (newUserDetails) {
        res.status(200).json({
          message: 'New user created',
          redirectTo: `/`
        });
      } else {
        res.status(401).json({error: 'Unable to create new user'});
      }
    })

}),



//--------------------------User Profile Page Logic-------------------------

//if all the datafields on the page have been populated after the 
//DOM has rendered then submit will call the UPDATE database query
app.post('/updateUserInformation', (req, res) => {
  const {fName, lName, userAge, userSex, height, weight, uID} = req.body

  updateUserInformation(fName, lName, userAge, userSex, height, weight, uID, (updateUserInformation) => {
    if (updateUserInformation) {

      res.status(200).json({message: 'User information updated successfully'})
    } else {
      res.status(401).json({ error: 'Error updating user information' });
    }
  });
});

function updateUserInformation(fName, lName, userAge, userSex, height, weight, uID, callback){
  // uID and sex are hardcoded 
  const query = "UPDATE user_info SET fName = ?, lName = ?, age = ?, sex = ?, weight = ?, height = ? WHERE uID = ?";
  connection.query(query, [fName, lName, userAge, userSex, weight, height, uID], (error, results) => {
    if (error) {
      console.error('Error executing update query:', error);
      callback(false);
    } else {
      console.log(results);
      callback(true);
    }
  });
}

//new user will enter information
app.post('/enterUserInformation', (req, res) => {
  const {uID, fName, lName, userAge, userSex, height, weight} = req.body
  enterUserInformation(uID, fName, lName, userAge, userSex, height, weight, (enterUserInformation) => {
    if (enterUserInformation) {
      res.status(200).json({message: 'User information entered successfully'})
    } else {
      res.status(401).json({ error: 'Error updating user information' });
    }
  });
});

function enterUserInformation(uID, fName, lName, userAge, userSex, height, weight, callback){
  // uID and sex are hardcoded 
  const query = "INSERT INTO user_info (uID, fName, lName, age, sex, height, weight) VALUES (?, ?, ?, ?, ?, ?, ?)";
  connection.query(query, [uID, fName, lName, userAge, userSex, weight, height], (error, results) => {
    if (error) {
      console.error('Error executing update query:', error);
      callback(false);
    } else {
      console.log(results);
      callback(true);
    }
  });
}

//autopopulate user information into fields
app.get('/getUserInformation/:uID', (req, res) => {
  const uID = req.params.uID;
  const query = "SELECT * FROM user_info WHERE uID = ?";

  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});

app.get('/getLoginInformation/:uID', (req, res) => {
  const uID = req.params.uID;
  const query = "SELECT * from users WHERE uID = ?";

  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: 'Internal Server Error'});
    }
    else{
      if (results.length > 0){
        res.status(200).json(results[0]);
      } else {
        res.status(400).json({error: 'User not found'});
      }
    }
  })
})



