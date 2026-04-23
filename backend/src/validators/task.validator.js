// src/validators/task.validator.js
const { body, param, query } = require('express-validator');

const createTaskRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 255 }).withMessage('Title too long'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description max 2000 chars'),
];

const updateTaskRules = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 255 }).withMessage('Title too long'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be pending, in_progress, or completed'),
];

const idParamRules = [
  param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
];

module.exports = { createTaskRules, updateTaskRules, idParamRules };
