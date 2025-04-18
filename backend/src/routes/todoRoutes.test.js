const request = require('supertest');
const express = require('express');
const app = express();
const router = require('./todoRoutes');
const todoController = require('../controllers/todoController/todoController');
const authenticateJWT = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(router);

jest.mock('../controllers/todoController/todoController');
jest.mock('../middleware/authMiddleware');

const mockToken = jwt.sign({ userId: 1 }, 'secret', { expiresIn: '1h' });

describe('Todo Router', () => {
    beforeEach(() => {
        authenticateJWT.mockImplementation((req, res, next) => next());
    });

    describe('GET /', () => {
        it('should get todo lists', async () => {
            const mockTodoLists = [{ id: 1, name: 'List 1' }];
            todoController.getTodoLists.mockImplementation((req, res) =>
                res.json(mockTodoLists)
            );

            const response = await request(app)
                .get('/')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTodoLists);
        });
    });

    describe('POST /', () => {
        it('should create a todo list', async () => {
            const newList = { name: 'New List' };
            const createdList = { id: 1, ...newList };
            todoController.createTodoList.mockImplementation((req, res) =>
                res.status(201).json(createdList)
            );

            const response = await request(app)
                .post('/')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(newList);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdList);
        });
    });

    describe('PUT /:listId', () => {
        it('should update a todo list', async () => {
            const updatedList = { id: 1, name: 'Updated List' };
            todoController.updateTodoList.mockImplementation((req, res) =>
                res.json(updatedList)
            );

            const response = await request(app)
                .put('/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ name: 'Updated List' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedList);
        });
    });

    describe('DELETE /:listId', () => {
        it('should delete a todo list', async () => {
            todoController.deleteTodoList.mockImplementation((req, res) =>
                res.status(204).send()
            );

            const response = await request(app)
                .delete('/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(204);
        });
    });

    describe('GET /:listId/tasks', () => {
        it('should get tasks of a list', async () => {
            const mockTasks = [{ id: 1, name: 'Task 1' }];
            todoController.getTasks.mockImplementation((req, res) =>
                res.json(mockTasks)
            );

            const response = await request(app)
                .get('/1/tasks')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
        });
    });

    describe('POST /:listId/tasks', () => {
        it('should add a task to a list', async () => {
            const newTask = { name: 'New Task' };
            const createdTask = { id: 1, ...newTask };
            todoController.addTask.mockImplementation((req, res) =>
                res.status(201).json(createdTask)
            );

            const response = await request(app)
                .post('/1/tasks')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(newTask);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(createdTask);
        });
    });

    describe('PUT /tasks/:taskId', () => {
        it('should update a task', async () => {
            const updatedTask = { id: 1, name: 'Updated Task' };
            todoController.updateTask.mockImplementation((req, res) =>
                res.json(updatedTask)
            );

            const response = await request(app)
                .put('/tasks/1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({ name: 'Updated Task' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedTask);
        });
    });

    describe('DELETE /tasks/:taskId', () => {
        it('should delete a task', async () => {
            todoController.deleteTask.mockImplementation((req, res) =>
                res.status(204).send()
            );

            const response = await request(app)
                .delete('/tasks/1')
                .set('Authorization', `Bearer ${mockToken}`);

            expect(response.status).toBe(204);
        });
    });
});
