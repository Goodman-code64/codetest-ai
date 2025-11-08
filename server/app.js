const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
// Import routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);



app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});



