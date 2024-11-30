exports.createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const task = new Task({
            userId: req.user.id,
            title,
            description,
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        next(error);
    }
};

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

        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id, deleted: false },
            { title, description, status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id, deleted: false },
            { deleted: true },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};
