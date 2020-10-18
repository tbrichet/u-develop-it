// Import Sqlite3 package
// Verbose mode produces messages in the terminal regarding the state of the runtime
const sqlite3 = require('sqlite3').verbose();

const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Connect the application to the SQLite database
const db = new sqlite3.Database('./db/election.db', err => {
  if (err) {
    return console.error(err.message);
  }

  console.log('Connected to the election database.');
});

// Import inputCheck function to test user input for new candidates
const inputCheck = require('./utils/inputCheck');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

// GET single candidate
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates 
               WHERE id = ?`;
  const params = [req.params.id];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: row
    });
  });
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
  const sql = `SELECT * FROM candidates`;
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      // 500 error message if server error
      res.status(500).json({ error: err.message });
      return;
    }
    // Send response as a JSON object to the browser
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({
      message: 'successfully deleted',
      changes: this.changes
    });
  });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
              VALUES (?,?,?)`;

  const params = [body.first_name, body.last_name, body.industry_connected];
  
  // ES5 function, not arrow function, to use `this`
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: body,
      id: this.lastID
    });
  });
});

// Default response for any other request(Not Found) Catch all (**INCLUDE LAST)
app.use((req, res) => {
    res.status(404).end();
  });


  // Listener to start Express.js server on port 3001
  // Make sure Express.js server doesn't start before the connection to the database has been established
db.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });