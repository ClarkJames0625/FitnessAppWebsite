// const express = require('express');
// const path = require('path');
// const app = express();
// const port = process.env.PORT || 5500;
// const frontEndPath = path.join(__dirname, '../', '../', '../', 'Front-end');

// // Serve static files from the 'Front-end' directory
// app.use(express.static(frontEndPath));

// // Define a route for the root path
// app.get('/', (req, res) => {
//     res.sendFile(path.join(frontEndPath, 'Login', 'index.html'));
// });

// // Define more routes and middleware as needed

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


// const express = require('express');
// const path = require('path');
// const app = express();
// const port = process.env.PORT || 5500;

// // Assuming your front-end files are in the 'Front-end' directory
// const frontEndPath = path.join(__dirname, '..', '..', 'Front-end');

// // Serve static files from the 'Front-end' directory
// app.use(express.static(frontEndPath));

// // Define a route for the root path
// app.get('/', (req, res) => {
//     res.sendFile(path.join(frontEndPath, 'Login', 'index.html'));
// });

// // Define more routes and middleware as needed

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


//Static files
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5500;
const frontEndPath = path.join(__dirname, '../', '../', '../', 'Front-end');

// Serve static files from the 'Front-end' directory
app.use(express.static(frontEndPath));

// Define a route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(frontEndPath, 'Login', 'index.html'));
});

// Define more routes and middleware as needed

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
