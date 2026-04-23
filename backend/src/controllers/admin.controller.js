// src/controllers/admin.controller.js
const User = require('../models/user.model');
const Task = require('../models/task.model');

// GET /api/v1/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await User.findAll({ page, limit });

    res.json({
      success: true,
      data: result.users,
      pagination: { total: result.total, page, limit, totalPages: Math.ceil(result.total / limit) },
    });
  } catch (err) { next(err); }
};

// DELETE /api/v1/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself.' });
    }
    const deleted = await User.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) { next(err); }
};

// GET /api/v1/admin/tasks
const getAllTasks = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await Task.findAll({ page, limit });

    res.json({
      success: true,
      data: result.tasks,
      pagination: { total: result.total, page, limit, totalPages: Math.ceil(result.total / limit) },
    });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, deleteUser, getAllTasks };
