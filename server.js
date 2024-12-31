const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const fetch = require('node-fetch'); // For sending requests to ESP32
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

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key'; // Use a secure key for your JWT

// Routes

// Register Route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).send({ error: 'Registration failed' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows.length) return res.status(404).send({ error: 'User not found' });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY);
    res.status(200).send({ token });
  } catch (err) {
    res.status(400).send({ error: 'Login failed' });
  }
});

// Middleware to authenticate the token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    req.user = user; // Add user data to request object
    next(); // Pass control to the next middleware or route handler
  });
}

// Servo control route (protected by token)
app.post('/servo', authenticateToken, async (req, res) => {
  const { action } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'Action is required.' });
  }

  // Example of how you would communicate with the ESP32 to control the servo
  try {
    const espUrl = `http://192.168.43.56/control_servo`; // Replace with actual ESP32 IP address
    const response = await fetch(espUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: action }),
    });

    if (response.ok) {
      res.status(200).json({ message: `Servo action "${action}" executed successfully` });
    } else {
      res.status(500).json({ error: 'Failed to communicate with the ESP32' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error sending request to ESP32' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
