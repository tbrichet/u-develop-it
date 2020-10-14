const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// // Test the Express.js Connection
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Hello World'
//     });
// });

// Default response for any other request(Not Found) Catch all (**INCLUDE LAST)
app.use((req, res) => {
    res.status(404).end();
  });

// Listener to start Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });