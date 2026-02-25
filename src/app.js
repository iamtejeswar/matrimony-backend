const express = require('express');
const cors = require('cors');
const admin = require('./config/firebase'); // 🔥 add this
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Matrimony Backend API is Running 🚀');
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// 🔥 Firebase Test Route
app.get('/api/firebase-test', async (req, res) => {
  try {
    await admin.auth().listUsers(1);
    res.status(200).json({
      success: true,
      message: "Firebase connected successfully 🚀"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);

module.exports = app;