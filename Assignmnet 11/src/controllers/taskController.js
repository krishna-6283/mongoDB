const Task = require('../models/Task');

/**
 * @route POST /api/tasks
 * @desc Create a new task
 */
exports.createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const newTask = new Task({
            userId: req.user.id, // Extracted from the JWT in the authentication middleware
            title,
            description,
        });

        await newTask.save();

        res.status(201).json({ message: 'Task created successfully', task: newTask });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /api/tasks
 * @desc Get tasks for the authenticated user
 */
exports.getTasks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'asc', search = '' } = req.query;

        const query = {
            userId: req.user.id,
            deleted: false,
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
        };

        const tasks = await Task.find(query)
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
 * @route PUT /api/tasks/:id
 * @desc Update a task by ID
 */
exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findOne({ _id: id, userId: req.user.id, deleted: false });
        if (!task) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;

        await task.save();

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        next(error);
    }
};

/**
 * @route DELETE /api/tasks/:id
 * @desc Soft delete a task by ID
 */
exports.deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({ _id: id, userId: req.user.id, deleted: false });
        if (!task) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }

        task.deleted = true;
        await task.save();

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * @route PATCH /api/tasks/:id/status
 * @desc Update the status of a task
 */
exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const task = await Task.findOne({ _id: id, userId: req.user.id, deleted: false });
        if (!task) {
            return res.status(404).json({ error: 'Task not found or not authorized' });
        }

        task.status = status;
        await task.save();

        res.json({ message: 'Task status updated successfully', task });
    } catch (error) {
        next(error);
    }
};
