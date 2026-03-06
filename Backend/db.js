const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;