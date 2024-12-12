const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your DB username
  password: '', // Replace with your DB password
  database: 'collabzone',
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

// API Endpoints
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('User registered successfully!');
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(404).send('User not found');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

app.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');

    const query = 'SELECT name, email, skills, travelHistory FROM users WHERE id = ?';
    db.query(query, [decoded.id], (err, results) => {
      if (err || results.length === 0) return res.status(404).send('User not found');
      res.status(200).json(results[0]);
    });
  });
});

app.post('/update-profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');

    const { name, skills, travelHistory } = req.body;
    const query = 'UPDATE users SET name = ?, skills = ?, travelHistory = ? WHERE id = ?';

    db.query(query, [name, skills, travelHistory, decoded.id], (err) => {
      if (err) return res.status(500).send(err);
      res.status(200).send('Profile updated successfully!');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
