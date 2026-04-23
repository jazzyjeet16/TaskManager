// src/models/task.model.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
}, {
  timestamps: true,
});

// Static methods
taskSchema.statics.findByUser = function(user_id, { page = 1, limit = 10, status }) {
  const skip = (page - 1) * limit;
  const query = { user_id };
  
  if (status) {
    query.status = status;
  }

  return Promise.all([
    this.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('user_id', 'name email'),
    this.countDocuments(query)
  ]).then(([tasks, total]) => ({ tasks, total }));
};

taskSchema.statics.findAll = function({ page = 1, limit = 10 }) {
  const skip = (page - 1) * limit;
  
  return Promise.all([
    this.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'name email'),
    this.countDocuments()
  ]).then(([tasks, total]) => ({ tasks, total }));
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
