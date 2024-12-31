const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

let currentAngle = 90;  // Default angle is 90

app.use(bodyParser.json());
app.use(cors());

// Endpoint to receive angle updates
app.post('/servo', (req, res) => {
  const { angle } = req.body;

  // Log the incoming angle and the current angle stored in the backend
  console.log(`Received angle: ${angle}`);
  console.log(`Current angle before update: ${currentAngle}`);

  if (angle >= 0 && angle <= 180) {
    currentAngle = angle;  // Update the angle in the backend
    console.log(`Updated angle to: ${currentAngle}`);
    res.status(200).json({ angle: currentAngle });  // Send the updated angle back to the ESP32
  } else {
    res.status(400).json({ error: 'Invalid angle' });
  }
});

// Endpoint to get the current angle (useful if the ESP32 needs to query the angle)
app.get('/servo', (req, res) => {
  res.status(200).json({ angle: currentAngle });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
