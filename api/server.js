require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message || err);
        process.exit(1);
    });

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema, 'user');

// API Endpoint for Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login request received:', username); // Debugging log

        const user = await User.findOne({ username, password });
        console.log('Login request received:', user); // Debugging log

        if (user) {
            return res.status(200).send({ message: 'Login successful' });
        } else {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in /login:', error.message || error);
        return res.status(500).send({ message: 'An error occurred on the server' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
