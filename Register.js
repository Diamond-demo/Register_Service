const e1 = require('express');
const bcrypt = require('bcryptjs');
var app = e1();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbconnect = require('./dbConnect.js');
const UserModel = require('./user_schema.js');

const PORT = 5001;


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

    // Encrypt the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new UserModel({ 
      userId: newUserId, 
      username, 
      password: hashedPassword 
    });

    await newUser.save(); 

    res.status(201).json({ message: 'User registered successfully!', userId: newUserId });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Error registering user!' });
  }
  
});


// START THE EXPRESS SERVER. 5000 is the PORT NUMBER
app.listen(PORT, () => console.log('EXPRESS Server Started at Port No: ' + PORT));
