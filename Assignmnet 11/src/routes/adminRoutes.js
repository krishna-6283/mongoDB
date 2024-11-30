const express = require('express');
const router = express.Router();
const { verifyAdmin, getAllTasks, getAllUsers, deleteTaskHard } = require('../controllers/adminAccess');
const authenticate = require('../middleware/authenticate'); // Middleware to authenticate users

// Admin routes
router.use(authenticate); // Ensure the user is authenticated for all routes below
router.use(verifyAdmin);  // Ensure the user is an admin for all routes below

router.get('/tasks', getAllTasks); // Get all tasks
router.get('/users', getAllUsers); // Get all users
router.delete('/tasks/:id', deleteTaskHard); // Hard delete a task

module.exports = router;
