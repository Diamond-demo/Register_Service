const e1 = require('express');
var app = e1();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbConnect.js');
const UserModel = require('./user_schema.js');


//REG API
app.post('/register', async (req, res) => {

  try {
    const { username, password } = req.body;

    // Check if username already exists
    const userExists = await UserModel.findOne({ username });
    if (userExists) return res.status(400).json({ message: "User already exists!" });

    // Find the last userId and increment
    const lastUser = await UserModel.findOne().sort({ userId: -1 });
    const newUserId = lastUser ? lastUser.userId + 1 : 1000; // Start from 1000 if no users exist

    // Create new user with incremented userId
    const newUser = new UserModel({ userId: newUserId, username, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', userId: newUserId });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error registering user!' });
  }
  
});


// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(5000, () => console.log('EXPRESS Server Started at Port No: 5000'));
