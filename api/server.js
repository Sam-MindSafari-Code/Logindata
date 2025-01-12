const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Static Files
app.use(express.static(path.join(__dirname, '../public')));

//MongoDB Connection
//hard coded connection place. My user and password for database is yeeh4006 and newpassword
//In MongoDB atlas you can create a user that has certain permissions to access data.
//In my case user yeeh4006 with password newpassword has access to testcluster/testloginData for users
mongoose.connect('mongodb+srv://yeeh4006:newpassword@testcluster.5b3hy.mongodb.net/testloginData?retryWrites=true&w=majority&appName=TestCluster')
    //If successful
    .then(() => console.log('Connected to MongoDB Atlas'))
    //if not successful
    .catch((err) => {
        console.error('MongoDB connection error:', err.message || err);
        process.exit(1);
    });

//User Schema, has to match the one in MongoDB Atlas
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema, 'user');

//API Endpoint for Login
app.post('/login', async (req, res) => {
    try {
        //Gives message when successful on what database and user is used
        //Should be whatever username you used + yeeh4006 in user
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

//Start Server, this is hard coded to Port 5000, so to check look at localhost:5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
