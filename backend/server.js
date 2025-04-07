require('dotenv').config();
const express = require('express');
const cors = require('cors'); // used to communicate with frontend
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware to handle CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "*", // URL of the frontend app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow credentials (like cookies) to be sent across domains
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

// Note: every route should start with '/'
app.use("/api/v1/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});