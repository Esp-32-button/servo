const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json());

// Store the current angle (initially set to 90)
let currentAngle = 90;

app.post('/servo', (req, res) => {
  const { angle } = req.body;

  if (angle !== undefined) {
    currentAngle = angle;  // Update the angle based on the request from ESP32
    console.log(`Received angle: ${angle}`);
  }

  // Respond with the current angle (latest)
  res.json({ angle: currentAngle });
});

// Set the server to listen on port 3000 (or any other available port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
