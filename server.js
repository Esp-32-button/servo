const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Assuming you're using ESP32Servo library on the ESP32 to control the servo
const Servo = require('ESP32Servo');
const myServo = new Servo();
const servoPin = 5; // Make sure this pin is correct for your setup
myServo.attach(servoPin);

// POST request to move the servo
app.post('/servo', (req, res) => {
  const { angle } = req.body; // Get the angle from the request body
  console.log(`Received angle: ${angle}`);

  if (angle < 0 || angle > 180) {
    return res.status(400).json({ message: 'Invalid angle, must be between 0 and 180' });
  }

  // Move the servo to the angle received
  myServo.write(angle);
  res.status(200).json({ message: 'Servo moved successfully', angle });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
