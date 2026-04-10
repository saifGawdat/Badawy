const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const username = 'admin';
const password = 'adminpassword123'; // Change this as needed

const setup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Admin user already exists. Updating password...');
      existingUser.password = password;
      await existingUser.save();
      console.log('Admin password updated successfully');
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      console.log('Admin user created successfully');
    }

    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    
    process.exit();
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
};

setup();
