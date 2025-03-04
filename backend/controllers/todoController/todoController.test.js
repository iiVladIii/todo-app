const { mock } = require('jest-mock-extended');
const TodoList = require('../../models/todoListModel');
const Task = require('../../models/taskModel');
const todoController = require('./todoController');

describe('TodoController', () => {
    let req, res;

    beforeEach(() => {
        req = mock();
        res = mock();
        res.json = jest.fn().mockImplementation((result) => result);
        res.status = jest.fn().mockReturnThis();
    });

    describe('getTodoLists', () => {
        it('should return todo lists for a user', async () => {
            req.user = { userId: 1 };
            const todoLists = [{ id: 1, name: 'Sample List', userId: 1 }];
            TodoList.findAll = jest.fn().mockResolvedValue(todoLists);

            await todoController.getTodoLists(req, res);
            expect(res.json).toHaveBeenCalledWith(todoLists);
        });

        it('should handle errors', async () => {
            req.user = { userId: 1 };
            TodoList.findAll = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.getTodoLists(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to fetch todo lists',
            });
        });
    });

    describe('createTodoList', () => {
        it('should create a new todo list', async () => {
            req.user = { userId: 1 };
            req.body = { name: 'New List' };
            const newList = { id: 1, name: 'New List', userId: 1 };
            TodoList.create = jest.fn().mockResolvedValue(newList);

            await todoController.createTodoList(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newList);
        });

        it('should handle errors', async () => {
            req.user = { userId: 1 };
            req.body = { name: 'New List' };
            TodoList.create = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.createTodoList(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create todo list',
            });
        });
    });

    describe('updateTodoList', () => {
        it('should update an existing todo list', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            req.body = { name: 'Updated List' };
            const existingList = {
                id: 1,
                name: 'Old List',
                userId: 1,
                save: jest.fn(),
            };
            TodoList.findOne = jest.fn().mockResolvedValue(existingList);

            await todoController.updateTodoList(req, res);
            expect(existingList.name).toBe('Updated List');
            expect(existingList.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(existingList);
        });

        it('should handle list not found', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            TodoList.findOne = jest.fn().mockResolvedValue(null);

            await todoController.updateTodoList(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Todo list not found',
            });
        });

        it('should handle errors', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            TodoList.findOne = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.updateTodoList(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to update todo list',
            });
        });
    });

    describe('deleteTodoList', () => {
        it('should delete an existing todo list', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            const existingList = { id: 1, userId: 1, destroy: jest.fn() };
            TodoList.findOne = jest.fn().mockResolvedValue(existingList);

            await todoController.deleteTodoList(req, res);
            expect(existingList.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Todo list deleted',
            });
        });

        it('should handle list not found', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            TodoList.findOne = jest.fn().mockResolvedValue(null);

            await todoController.deleteTodoList(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Todo list not found',
            });
        });

        it('should handle errors', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            TodoList.findOne = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.deleteTodoList(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to delete todo list',
            });
        });
    });
    describe('getTasks', () => {
        it('should return tasks for a todo list', async () => {
            req.params = { listId: 1 };
            const tasks = [{ id: 1, title: 'Task 1', listId: 1 }];
            Task.findAll = jest.fn().mockResolvedValue(tasks);

            await todoController.getTasks(req, res);
            expect(Task.findAll).toHaveBeenCalledWith({
                where: { listId: req.params.listId },
            });
            expect(res.json).toHaveBeenCalledWith(tasks);
        });

        it('should handle errors when fetching tasks', async () => {
            req.params = { listId: 1 };
            Task.findAll = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.getTasks(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to fetch tasks',
            });
        });
    });

    describe('addTask', () => {
        it('should add a task to a todo list', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            req.body = { title: 'New Task', completed: false };
            const todoList = { id: 1, userId: 1 };
            TodoList.findOne = jest.fn().mockResolvedValue(todoList);
            const newTask = { id: 1, title: 'New Task', listId: 1 };
            Task.create = jest.fn().mockResolvedValue(newTask);

            await todoController.addTask(req, res);
            expect(TodoList.findOne).toHaveBeenCalledWith({
                where: { id: req.params.listId, userId: req.user.userId },
            });
            expect(Task.create).toHaveBeenCalledWith({
                title: req.body.title,
                completed: req.body.completed,
                listId: todoList.id,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newTask);
        });

        it('should handle todo list not found when adding a task', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            TodoList.findOne = jest.fn().mockResolvedValue(null);

            await todoController.addTask(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Todo list not found',
            });
        });

        it('should handle errors when adding a task', async () => {
            req.user = { userId: 1 };
            req.params = { listId: 1 };
            TodoList.findOne = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.addTask(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to add task',
            });
        });
    });

    describe('updateTask', () => {
        it('should update an existing task', async () => {
            req.params = { taskId: 1 };
            req.body = { title: 'Updated Task', completed: true };
            const existingTask = {
                id: 1,
                title: 'Old Task',
                completed: false,
                save: jest.fn(),
            };
            Task.findOne = jest.fn().mockResolvedValue(existingTask);

            await todoController.updateTask(req, res);
            expect(existingTask.title).toBe(req.body.title);
            expect(existingTask.completed).toBe(req.body.completed);
            expect(existingTask.save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(existingTask);
        });

        it('should handle task not found', async () => {
            req.params = { taskId: 1 };
            Task.findOne = jest.fn().mockResolvedValue(null);

            await todoController.updateTask(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
        });

        it('should handle errors when updating a task', async () => {
            req.params = { taskId: 1 };
            Task.findOne = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.updateTask(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to update task',
            });
        });
    });

    describe('deleteTask', () => {
        it('should delete an existing task', async () => {
            req.params = { taskId: 1 };
            const existingTask = { id: 1, destroy: jest.fn() };
            Task.findOne = jest.fn().mockResolvedValue(existingTask);

            await todoController.deleteTask(req, res);
            expect(existingTask.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted' });
        });

        it('should handle task not found', async () => {
            req.params = { taskId: 1 };
            Task.findOne = jest.fn().mockResolvedValue(null);

            await todoController.deleteTask(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
        });

        it('should handle errors when deleting a task', async () => {
            req.params = { taskId: 1 };
            Task.findOne = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await todoController.deleteTask(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to delete task',
            });
        });
    });
});
