// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const db = require('./src/config/db');
require('dotenv').config(); // Load environment variables

const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/task');

const app = express();
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://johnjoek1:12345john@john-api.4svlp.mongodb.net/?retryWrites=true&w=majority&appName=John-API';

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());


 //Connect to MongoDB
mongoose.connect(MONGO_URI, {})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
