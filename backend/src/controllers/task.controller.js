// src/controllers/task.controller.js
const Task = require('../models/task.model');

// ─── POST /api/v1/tasks ───────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, user_id: req.user.id });
    res.status(201).json({ success: true, message: 'Task created.', task });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/tasks ────────────────────────────────
const getTasks = async (req, res, next) => {
  try {
    const page   = parseInt(req.query.page)   || 1;
    const limit  = parseInt(req.query.limit)  || 10;
    const status = req.query.status           || null;

    const result = await Task.findByUser(req.user.id, { page, limit, status });

    res.json({
      success: true,
      data: result.tasks,
      pagination: {
        total:       result.total,
        page,
        limit,
        totalPages:  Math.ceil(result.total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/tasks/:id ────────────────────────────
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    // Users can only see their own tasks
    if (task.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/v1/tasks/:id ──────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (task.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const updated = await Task.update(req.params.id, req.body);
    res.json({ success: true, message: 'Task updated.', task: updated });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/v1/tasks/:id ─────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    if (task.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await Task.delete(req.params.id);
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
