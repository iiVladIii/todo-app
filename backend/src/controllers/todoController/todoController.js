const TodoList = require('../../models/todoListModel');
const Task = require('../../models/taskModel');

exports.getTodoLists = async (req, res) => {
    try {
        const todoLists = await TodoList.findAll({
            where: { userId: req.user.userId },
        });
        res.json(todoLists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch todo lists' });
    }
};

exports.createTodoList = async (req, res) => {
    const { name } = req.body;
    try {
        const todoList = await TodoList.create({
            name,
            userId: req.user.userId,
        });
        res.status(201).json(todoList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create todo list' });
    }
};

exports.updateTodoList = async (req, res) => {
    const { listId } = req.params;
    const { name } = req.body;
    try {
        const todoList = await TodoList.findOne({
            where: { id: listId, userId: req.user.userId },
        });
        if (!todoList) {
            return res.status(404).json({ error: 'Todo list not found' });
        }
        todoList.name = name || todoList.name;
        await todoList.save();
        res.json(todoList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo list' });
    }
};

exports.deleteTodoList = async (req, res) => {
    const { listId } = req.params;
    try {
        const todoList = await TodoList.findOne({
            where: { id: listId, userId: req.user.userId },
        });
        if (!todoList) {
            return res.status(404).json({ error: 'Todo list not found' });
        }
        await todoList.destroy();
        res.json({ message: 'Todo list deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo list' });
    }
};

exports.getTasks = async (req, res) => {
    const { listId } = req.params;
    try {
        const tasks = await Task.findAll({ where: { listId: listId } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

exports.addTask = async (req, res) => {
    const { title, completed } = req.body;
    const { listId } = req.params;
    try {
        const todoList = await TodoList.findOne({
            where: { id: listId, userId: req.user.userId },
        });
        if (!todoList) {
            return res.status(404).json({ error: 'Todo list not found' });
        }
        const task = await Task.create({
            title,
            completed: completed ?? false,
            listId: todoList.id,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
};

exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, completed } = req.body;
    try {
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        task.title = title || task.title;
        task.completed = completed !== undefined ? completed : task.completed;
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        const task = await Task.findOne({ where: { id: taskId } });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
