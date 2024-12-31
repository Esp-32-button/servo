const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// POST request to handle servo movement
app.post('/servo', (req, res) => {
  const { angle } = req.body; // Get the angle from the request body
  console.log(`Received angle: ${angle}`);

  if (angle < 0 || angle > 180) {
    return res.status(400).json({ message: 'Invalid angle, must be between 0 and 180' });
  }

  // Forward the angle to ESP32 (you need to implement this step in the ESP32 code)
  // The backend doesn't control the servo, it only forwards the data to the ESP32

  res.status(200).json({ message: 'Servo angle received', angle });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
