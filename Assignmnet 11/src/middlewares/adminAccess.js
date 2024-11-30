const Task = require('../models/Task');
const User = require('../models/User');

/**
 * Middleware to verify if the user has admin access
 */
exports.verifyAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/admin/tasks
 * @desc Get all tasks for all users (Admin access only)
 */
exports.getAllTasks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'asc', search = '' } = req.query;

        const query = {
            deleted: false,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        };

        const tasks = await Task.find(query)
            .populate('userId', 'username email') // Populate the user details for the tasks
            .sort({ [sort]: order === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        res.json({
            tasks,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/admin/users
 * @desc Get all users (Admin access only)
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        };

        const users = await User.find(query)
            .select('-password') // Exclude passwords
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route DELETE /api/admin/tasks/:id
 * @desc Hard delete a task (Admin access only)
 */
exports.deleteTaskHard = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.deleteOne();

        res.json({ message: 'Task permanently deleted' });
    } catch (error) {
        next(error);
    }
};
