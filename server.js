const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg');

const app = express();
const port = 3000;

// Setup PostgreSQL client for Neon
const client = new Client({
  connectionString: 'postgresql://neondb_owner:xQGXYaSt48Tr@ep-shy-bonus-a5nesqcq.us-east-2.aws.neon.tech/neondb?sslmode=require',  // Replace with your Neon DB connection string
});
client.connect();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create the table for storing the servo angle (run this once)
client.query(`
  CREATE TABLE IF NOT EXISTS servo_angle (
    id SERIAL PRIMARY KEY,
    angle INT NOT NULL DEFAULT 90
  );
  -- Insert initial row if the table is empty (run once)
  INSERT INTO servo_angle (angle)
  SELECT 90 WHERE NOT EXISTS (SELECT 1 FROM servo_angle);
`, (err, res) => {
  if (err) {
    console.error('Error creating table or inserting initial data:', err);
  } else {
    console.log('Table created and initialized successfully');
  }
});

// GET endpoint to retrieve the current servo angle from Neon DB
app.get('/servo', async (req, res) => {
  try {
    const result = await client.query('SELECT angle FROM servo_angle WHERE id = 1');
    const currentAngle = result.rows[0] ? result.rows[0].angle : 90; // Default to 90 if no angle is found
    res.json({ angle: currentAngle });
  } catch (error) {
    console.error('Error retrieving angle:', error);
    res.status(500).send('Error retrieving angle');
  }
});

// POST endpoint to update the servo angle in Neon DB
app.post('/servo', async (req, res) => {
  const angle = req.body.angle;

  if (angle < 0 || angle > 180) {
    return res.status(400).json({ error: 'Invalid angle' });
  }

  try {
    // Update the existing row with the new angle
    await client.query('UPDATE servo_angle SET angle = $1 WHERE id = 1', [angle]);
    res.json({ angle: angle }); // Return the updated angle
  } catch (error) {
    console.error('Error updating angle:', error);
    res.status(500).send('Error updating angle');
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
