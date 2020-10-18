const express = require('express');
const db = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.on('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});



// // Test the Express.js Connection
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

// // Test the connection to the database by using SQLite method to execute SQL commands
// db.all(`SELECT * FROM candidates`, (err, rows) => {
//   console.log(rows);
// });