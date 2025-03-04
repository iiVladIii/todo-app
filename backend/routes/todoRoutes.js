const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController/todoController');
const authenticateJWT = require('../middleware/authMiddleware');

router.use(authenticateJWT);

router.get('/', todoController.getTodoLists);
router.post('/', todoController.createTodoList);
router.put('/:listId', todoController.updateTodoList);
router.delete('/:listId', todoController.deleteTodoList);

router.get('/:listId/tasks', todoController.getTasks);
router.post('/:listId/tasks', todoController.addTask);
router.put('/tasks/:taskId', todoController.updateTask);
router.delete('/tasks/:taskId', todoController.deleteTask);

module.exports = router;
