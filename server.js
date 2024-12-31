const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Make sure you have this line
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());

app.post('/servo', (req, res) => {
  const { angle } = req.body;

  // Your logic to control the servo
  console.log(`Servo angle: ${angle}`);

  res.status(200).json({ message: 'Servo moved', angle });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
