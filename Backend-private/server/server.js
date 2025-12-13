// src/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateIssue');

const app = express();

// Enable CORS for frontend (React app)
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Parse incoming JSON bodies
app.use(express.json());

// Basic API status check
app.get('/', (req, res) => {
  res.send('API is running ✅');
});

// Certificate-related routes
app.use("/api/certificates", certificateRoutes);

// Authentication routes (login, register, etc.)
app.use('/api/auth', authRoutes);

// Institution dashboard / profile routes
app.use("/api/institutions", require("./routes/Institutionprofile"));

// Initialize MongoDB connection
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
