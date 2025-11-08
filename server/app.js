const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// List all allowed origins
const allowedOrigins = [
  
  'http://localhost:5173',
  'https://codetest-7l59yzm3z-jeenesh-rajputs-projects.vercel.app'
];

  


// Dynamic CORS origin check
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
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



