const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Example route to control the servo with an angle
app.post('/servo', async (req, res) => {
    const { angle } = req.body;

    if (angle < 0 || angle > 180) {
        return res.status(400).send({ error: 'Invalid angle. Angle must be between 0 and 180 degrees.' });
    }

    // Send the angle to the ESP32 to move the servo (you will need to forward this to ESP32 in real-world setup)
    console.log(`Moving servo to ${angle} degrees`);

    // Here you would forward the request to the ESP32 to control the servo
    // Example: send the angle to the ESP32 using HTTP request

    res.status(200).send({ message: `Servo moved to ${angle} degrees` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
