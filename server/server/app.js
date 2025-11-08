const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

let mockUsers = [];

// Health
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend running' });
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const userExists = mockUsers.find(u => u.email === email);
    if (userExists) return res.status(400).json({ error: 'Email already registered' });

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = mockUsers.length + 1;
    const newUser = { id: userId, email, password_hash: hashedPassword, name: name || 'User' };
    mockUsers.push(newUser);

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      message: 'User registered successfully',
      user: { id: userId, email, name: newUser.name },
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = mockUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const bcrypt = require('bcryptjs');
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Generate Tests
app.post('/api/tests/generate', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { topic = 'factorial', difficulty = 'medium', language = 'javascript' } = req.body;

    const tests = {
      factorial: [
        { name: 'Test 0!', description: 'Should return 1', input: '0', expectedOutput: '1', difficulty: 'easy' },
        { name: 'Test 5!', description: 'Should return 120', input: '5', expectedOutput: '120', difficulty: 'medium' },
        { name: 'Test 10!', description: 'Should return 3628800', input: '10', expectedOutput: '3628800', difficulty: 'hard' }
      ],
      fibonacci: [
        { name: 'Fib 1', description: 'First number', input: '1', expectedOutput: '1', difficulty: 'easy' },
        { name: 'Fib 6', description: 'Sixth number', input: '6', expectedOutput: '8', difficulty: 'medium' },
        { name: 'Fib 20', description: 'Twentieth number', input: '20', expectedOutput: '6765', difficulty: 'hard' }
      ],
      palindrome: [
        { name: 'Test racecar', description: 'Valid palindrome', input: 'racecar', expectedOutput: 'true', difficulty: 'easy' },
        { name: 'Test hello', description: 'Not palindrome', input: 'hello', expectedOutput: 'false', difficulty: 'easy' }
      ]
    };

    res.json({
      message: 'Tests generated successfully',
      topic,
      difficulty,
      language,
      tests: tests[topic.toLowerCase()] || tests.factorial,
      userId: decoded.userId
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
