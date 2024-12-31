const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Enable CORS and use JSON body parser
app.use(cors());
app.use(bodyParser.json());

// Store the last known angle (initial value is 90)
let lastAngle = 90;

app.post("/servo", (req, res) => {
  let angle = req.body.angle;
  console.log("Received angle:", angle); // Log the received angle

  if (angle >= 0 && angle <= 180) {
    lastAngle = angle; // Update the stored angle
    console.log("Updated angle:", lastAngle);
    res.json({ angle: lastAngle }); // Send the updated angle back to the ESP32
  } else {
    res.status(400).json({ error: "Invalid angle" }); // Error if angle is invalid
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
