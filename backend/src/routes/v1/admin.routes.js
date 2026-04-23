// src/routes/v1/admin.routes.js
const router       = require('express').Router();
const authenticate = require('../../middleware/auth.middleware');
const authorize    = require('../../middleware/role.middleware');
const { idParamRules } = require('../../validators/task.validator');
const validate     = require('../../middleware/validate.middleware');
const { getAllUsers, deleteUser, getAllTasks } = require('../../controllers/admin.controller');

// All admin routes: must be authenticated AND have admin role
router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     responses:
 *       200: { description: All users }
 *       403: { description: Forbidden }
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User deleted }
 */
router.delete('/users/:id', idParamRules, validate, deleteUser);

/**
 * @swagger
 * /api/v1/admin/tasks:
 *   get:
 *     summary: Get all tasks from all users (admin only)
 *     tags: [Admin]
 *     responses:
 *       200: { description: All tasks }
 */
router.get('/tasks', getAllTasks);

module.exports = router;
