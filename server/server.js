
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.set('trust proxy', 1);

const allowedOrigin =
  process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB before handling API requests.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);

    res.status(500).json({
      message: 'Database connection failed.',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ReadLog API!',
    status: 'Server running successfully',
  });
});

// Local development: run the Express server normally.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`ReadLog server running on port ${PORT}`);
  });
}

// Vercel uses the exported Express application.
module.exports = app;
