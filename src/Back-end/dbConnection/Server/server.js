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

app.get('/updateBMR/:uID', (req, res) => {
  const uID = req.params.uID;
  const BMR = req.query.BMR; // Retrieve BMR from query parameter using req.query.BMR
  const query = "UPDATE user_info SET BMR = ? WHERE uID = ?";

  connection.query(query, [BMR, uID], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: 'Internal Server Error'});
    }
    else{
      if (results.affectedRows > 0){ // Check if any rows are affected
        res.status(200).json({ message: 'BMR updated successfully' });
      } else {
        res.status(400).json({error: 'User not found or BMR value not provided'});
      }
    }
  })
})


//Goals Page Logic
// Express route to handle requests for retrieving current weight
app.get('/getCurrentWeight/:uID', (req, res) => {
  const uID = req.params.uID;
  const query = "SELECT weight FROM user_info WHERE uID = ?";

  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        res.status(200).json(results[0].weight); // Return the weight
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});

function getCurrentWeight(uID, callback) {
  const query = "SELECT weight FROM user_info WHERE uID = ?";
  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error('Error executing select query:', error);
      callback(false); // Indicate failure to the callback
    } else {
      console.log(results);
      callback(results[0].weight); // Pass the weight to the callback
    }
  });
}

app.post('/setFitnessGoal', (req, res) => {
  const {uID, dietType, dietDuration, currentWeight, weightGoal, formattedStartDate} = req.body
  console.log(req.body.start_date)
  setFitnessGoal(uID, dietType, dietDuration, currentWeight, weightGoal, formattedStartDate, (setFitnessGoal) => {
    if (setFitnessGoal) {
      console.log('true');
      res.status(200).json({message: 'Fitness Goal Saved Successfully'})
    } else {
      console.log('false');
      res.status(401).json({ error: 'Error Saving Fitness Goal' });
    }
  });
});

function setFitnessGoal(uID, dietType, dietDuration, currentWeight, weightGoal, formattedStartDate, callback){
  const query = "INSERT INTO diet_goals (uID, dietType, duration, currentWeight, goalWeight, start_date) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(query, [uID, dietType, dietDuration, currentWeight, weightGoal, formattedStartDate], (error, results) => {
    if (error) {
      console.error('Error executing update query:', error);
      callback(false);
    } else {
      console.log(results);
      callback(results);
    }
  });
}

//populate all fields once data has been inserted
app.get('/existingGoal/:uID', (req, res) => {
  const uID = req.params.uID;
  const query = "SELECT * FROM diet_goals WHERE uID = ?";

  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        res.status(200).json(results[0]); // Return the first row of results
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});

//update if goal already exists
app.put('/updateGoal/:uID', (req, res) => {
  const uID = req.params.uID;
  const { dietType, dietDuration, weightGoal, formattedStartDate } = req.body;

  // Perform the update operation in the database
  const query = "UPDATE diet_goals SET dietType = ?, duration = ?, goalWeight = ?, start_date = ? WHERE uID = ?";
  connection.query(query, [dietType, dietDuration, weightGoal, formattedStartDate, uID], (error, results) => {
      if (error) {
          console.error('Error updating fitness goal:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          console.log('Fitness goal updated successfully');
          res.status(200).json({ message: 'Fitness goal updated successfully' });
      }
  });
});

//get time remaining in diet
app.get('/timeRemaining/:uID', (req, res) => {
  const uID = req.params.uID;
  const query = "SELECT start_date, duration FROM diet_goals WHERE uID = ?";

  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const startDate = new Date(results[0].start_date);
        const durationInWeeks = results[0].duration;
        // Calculate end date based on start date and duration
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + durationInWeeks * 7); // Adding weeks as days
        // Calculate time remaining based on the current date and end date
        const currentDate = new Date();
        const timeDiff = endDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        res.status(200).json({ startDate, daysRemaining });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});

app.get('/avgCalories/:uID', (req, res) => {
  const uID = req.params.uID;
  const query = "SELECT SUM(calories) AS total_calories FROM food_eaten WHERE uID = ?";

  connection.query(query, [uID], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        console.log(results);
        res.status(200).json({results});
      } else {
        res.status(404).json({ error: 'Calorie count not retrieved' });
      }
    }
  });
});


//-------------Meals Page Logic
// Add meals route to fetch meals from the database
app.get('/meals', (req, res) => {
  getMeals((error, meals) => {
      if (error) {
          console.error('Error fetching meals from the database:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(meals); //meals is an array of meal objects retrieved from the database
      }
  });
});

// Function to fetch meals from the database
function getMeals(callback) {
  const query = "SELECT * FROM food"; //meals is the table name in your database
  connection.query(query, (error, results) => {
      if (error) {
          callback(error, null);
      } else {
          callback(null, results);
      }
  });
}

// Add meals via modal
app.post('/addMeals', (req, res) => {
  const { foodName, caloriesIn, mealType } = req.body;
  addMeals(foodName, caloriesIn, mealType, (error, result) => {
      if (error) {
          console.error('Error adding meals to the database:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json({ message: 'Meals added successfully' });
      }
  });
});

// Function to add meals to the database
function addMeals(foodName, caloriesIn, mealType, callback) {
  const query = "INSERT INTO food (foodName, caloriesIn, mealType) VALUES (?, ?, ?)";
  connection.query(query, [foodName, caloriesIn, mealType], (error, results) => {
      if (error) {
          callback(error, null);
      } else {
          callback(null, results);
      }
  });
}

// Add eaten meals to foods_eaten table
app.post('/addEatenMeals', (req, res) => {
  const mealsData = req.body.mealsData;
  const uID = req.body.uID; // Extract uID from the request body
  const date_eaten = req.body.currentDate; //extract current date from req body

  // Define the SQL query to insert a meal into the database
  const query = "INSERT INTO food_eaten (uID, foodName, calories, date_eaten, mealType) VALUES (?, ?, ?, ?, ?)";

  // Iterate over each meal in mealsData and insert it into the database
  mealsData.forEach(meal => {
      connection.query(query, [uID, meal.mealName, meal.calories, date_eaten, meal.mealType], (error, results, fields) => {
          if (error) {
              console.error('Error inserting data:', error);
              res.status(500).send('Error inserting data into database');
          } else {
              console.log('Data inserted successfully:', results);
          }
      });
  });

  // Send response to the client indicating that meals were added successfully
  res.status(200).send('Meals added successfully');
});

// Get all foods eaten today to populate fields for todaysMeals
app.post('/retrieveEatenMeals', (req, res) => {
  const {uID, currentDate} = req.body;
  console.log(req.body);
  console.log(uID, currentDate);
  // Define the SQL query to retrieve eaten meals from the database
  const query = "SELECT foodName, calories, mealType FROM food_eaten WHERE uID = ? AND date_eaten = ?";

  // Execute the SQL query
  connection.query(query, [uID, currentDate], (error, results, fields) => {
    if (error) {
      console.error('Error retrieving eaten meals', error);
      res.status(500).send('Error querying the database');
    } else {
      console.log('Data retrieved successfully:', results);
      res.status(200).json(results); // Respond with the retrieved data
    }
  });
});

//----------------------------Weekly Goal Logic Page
app.get('/weeklyAvgCalories/:uID', (req, res) => {
  const uID = req.params.uID;
  const weekStartDate = req.query.weekStartDate;
  const currentDate = req.query.currentDate;
  const query = "SELECT SUM(calories) AS total_calories FROM food_eaten WHERE uID = ? AND date_eaten BETWEEN ? AND ?";

  connection.query(query, [uID, weekStartDate, currentDate], (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          if (results.length > 0) {
              console.log(results);
              res.status(200).json({results});
          } else {
              res.status(404).json({ error: 'Calorie count not retrieved' });
          }
      }
  });
});


//-------------Activities Page Logic
// Add meals route to fetch meals from the database
app.get('/activities', (req, res) => {
  getActivities((error, meals) => {
      if (error) {
          console.error('Error fetching activities from the database:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json(meals); // activities is an array of meal objects retrieved from the database
      }
  });
});

// Function to fetch meals from the database
function getActivities(callback) {
  const query = "SELECT * FROM activities"; 
  connection.query(query, (error, results) => {
      if (error) {
          callback(error, null);
      } else {
          callback(null, results);
      }
  });
}

// Add meals via modal
app.post('/addActivity', (req, res) => {
  const { activityName, caloriesOut, activityType } = req.body;
  addActivity(activityName, caloriesOut, activityType, (error, result) => {
      if (error) {
          console.error('Error adding activities to the database:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          res.status(200).json({ message: 'activities added successfully' });
      }
  });
});

// Function to add meals to the database
function addActivity(activityName, caloriesOut, activityType, callback) {
  const query = "INSERT INTO activities (activityName, caloriesOut, activityType) VALUES (?, ?, ?)";
  connection.query(query, [activityName, caloriesOut, activityType], (error, results) => {
      if (error) {
          callback(error, null);
      } else {
          callback(null, results);
      }
  });
}

app.post('/retrieveCompletedActivities', (req, res) => {
  const {uID, currentDate} = req.body;
  console.log(req.body);
  console.log(uID, currentDate);
  // Define the SQL query to retrieve eaten meals from the database
  const query = "SELECT activityName, calories FROM activities_completed WHERE uID = ? AND date_eaten = ?";

  // Execute the SQL query
  connection.query(query, [uID, currentDate], (error, results, fields) => {
    if (error) {
      console.error('Error retrieving Activities', error);
      res.status(500).send('Error querying the database');
    } else {
      console.log('Data retrieved successfully:', results);
      res.status(200).json(results); // Respond with the retrieved data
    }
  });
});

