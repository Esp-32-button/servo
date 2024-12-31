const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client } = require('pg'); // Import PostgreSQL client

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Define the connection string (replace with your actual connection string)
const connectionString = 'postgresql://neondb_owner:xQGXYaSt48Tr@ep-shy-bonus-a5nesqcq.us-east-2.aws.neon.tech/neondb?sslmode=require';

// Connect to the Neon PostgreSQL database using the connection string
const client = new Client({
  connectionString: connectionString,  // Use the connection string directly
});

client.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the Neon database.');
});

// Endpoint to get the current servo angle from the database
app.get('/servo', (req, res) => {
  const query = 'SELECT angle FROM servo_table WHERE id = 1'; // Assuming a single row for servo data
  client.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching angle from database:', err);
      return res.status(500).json({ error: 'Failed to fetch angle' });
    }
    if (result.rows.length > 0) {
      return res.json({ angle: result.rows[0].angle });
    }
    res.status(404).json({ error: 'Angle not found' });
  });
});

// Endpoint to update the servo angle in the database
app.post('/servo', (req, res) => {
  const { angle } = req.body;
  if (angle < 0 || angle > 180) {
    return res.status(400).json({ error: 'Angle must be between 0 and 180' });
  }

  const query = 'UPDATE servo_table SET angle = $1 WHERE id = 1'; // Update the angle value in the table
  client.query(query, [angle], (err, result) => {
    if (err) {
      console.error('Error updating angle in database:', err);
      return res.status(500).json({ error: 'Failed to update angle' });
    }
    res.json({ success: true, angle: angle }); // Return the updated angle in the response
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
