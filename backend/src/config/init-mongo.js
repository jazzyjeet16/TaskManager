// src/config/init-mongo.js
// MongoDB initialization script
// Run this script to create initial data and indexes

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Task = require('../models/task.model');

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB for initialization');

    // Create indexes for better performance
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Task.collection.createIndex({ user_id: 1 });
    await Task.collection.createIndex({ status: 1 });
    await Task.collection.createIndex({ createdAt: -1 });
    console.log('✅ Database indexes created');

    // Create default admin user if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@taskmanager.com',
        password: 'admin123', // Will be hashed automatically
        role: 'admin'
      });
      console.log('✅ Default admin user created');
    }

    console.log('✅ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
initDatabase();
