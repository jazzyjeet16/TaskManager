// src/routes/v1/task.routes.js
const router       = require('express').Router();
const authenticate = require('../../middleware/auth.middleware');
const validate     = require('../../middleware/validate.middleware');
const { createTaskRules, updateTaskRules, idParamRules } = require('../../validators/task.validator');
const { createTask, getTasks, getTask, updateTask, deleteTask } = require('../../controllers/task.controller');

// All task routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task CRUD (authenticated users)
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get my tasks (paginated, filterable by status)
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in_progress, completed] }
 *     responses:
 *       200: { description: List of tasks }
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Task created }
 */
router.route('/')
  .get(getTasks)
  .post(createTaskRules, validate, createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get single task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Task data }
 *       404: { description: Not found }
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *     responses:
 *       200: { description: Task updated }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Task deleted }
 */
router.route('/:id')
  .get(idParamRules, validate, getTask)
  .patch(idParamRules, updateTaskRules, validate, updateTask)
  .delete(idParamRules, validate, deleteTask);

module.exports = router;
