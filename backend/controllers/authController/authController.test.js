const { mock } = require('jest-mock-extended');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const TodoList = require('../../models/todoListModel');
const authController = require('./authController');
const { jwtSecret } = require('../../config/config');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let req, res;

    beforeEach(() => {
        req = mock();
        res = mock();
        res.json = jest.fn().mockImplementation((result) => result);
        res.status = jest.fn().mockReturnThis();
    });

    describe('register', () => {
        it('should register a new user', async () => {
            req.body = { username: 'user1', password: 'password123' };
            const hashedPassword = 'hashedPassword123';
            bcrypt.hash.mockResolvedValue(hashedPassword);
            const newUser = { id: 1, username: 'user1' };
            const newList = { id: 1, name: 'Default', userId: newUser.id };
            User.create = jest.fn().mockResolvedValue(newUser);
            TodoList.create = jest.fn().mockResolvedValue(newList);

            await authController.register(req, res);
            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 10);
            expect(User.create).toHaveBeenCalledWith({
                username: req.body.username,
                password: hashedPassword,
            });
            expect(TodoList.create).toHaveBeenCalledWith({
                name: 'Default',
                userId: newUser.id,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User created',
                userId: newUser.id,
            });
        });

        it('should handle errors during registration', async () => {
            req.body = { username: 'user1', password: 'password123' };
            bcrypt.hash.mockRejectedValue(new Error('Hashing Error'));

            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'User creation failed',
            });
        });
    });

    describe('login', () => {
        it('should login a user and return a token', async () => {
            req.body = { username: 'user1', password: 'password123' };
            const user = {
                id: 1,
                username: 'user1',
                password: 'hashedPassword123',
            };
            User.findOne = jest.fn().mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            const token = 'jsonwebtoken123';
            jwt.sign.mockReturnValue(token);

            await authController.login(req, res);
            expect(User.findOne).toHaveBeenCalledWith({
                where: { username: req.body.username },
            });
            expect(bcrypt.compare).toHaveBeenCalledWith(
                req.body.password,
                user.password
            );
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: user.id },
                jwtSecret,
                { expiresIn: '1h' }
            );
            expect(res.json).toHaveBeenCalledWith({ token });
        });

        it('should handle invalid username', async () => {
            req.body = { username: 'user1', password: 'password123' };
            User.findOne = jest.fn().mockResolvedValue(null);

            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid username or password',
            });
        });

        it('should handle invalid password', async () => {
            req.body = { username: 'user1', password: 'wrongPassword' };
            const user = {
                id: 1,
                username: 'user1',
                password: 'hashedPassword123',
            };
            User.findOne = jest.fn().mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid username or password',
            });
        });

        it('should handle errors during login', async () => {
            req.body = { username: 'user1', password: 'password123' };
            User.findOne = jest
                .fn()
                .mockRejectedValue(new Error('Database Error'));

            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
        });
    });
});
