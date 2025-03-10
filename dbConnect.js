// STEP-1 : IMPORT MONGOOSE PACKAGE
require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('./user_schema.js');

// Database Connection URL
//Mongoose is an Object Document Mapper (ODM)
const url = process.env.MONGO_URI;

// STEP-2 : ESTABLISH CONNECTION WITH MONGODB DATABASE THROUGH MONGOOSE
// err is callback function Parameter. ARROW OPERATOR.
// JSON.stringify convert Object to String. 2 means Indentation of Two space Character 
mongoose.connect(url)
    .then(async () => {
        console.log('NODEJS TO MongoDB Connection ESTABLISH.....');

        // Check if an admin exists
        const adminExists = await UserModel.findOne({ role: "admin" });
        if (!adminExists) {
            
            const hashedPassword = await bcrypt.hash("admin", 10); // Encrypt password
            const adminUser = new UserModel({
                userId: 1,
                username: "admin",
                password: hashedPassword,  
                role: "admin"
            });

            await adminUser.save();
            console.log('Admin account created successfully.');
        } else {
            console.log('Admin account already exists.');
        }
    })
    .catch(err => {
        console.log('Error in DB connection: ' + JSON.stringify(err, undefined, 2));
        process.exit();
    });
    
// STEP-3 : EXPORT MODULE mongoose because we need it in other JS file
module.exports = mongoose;