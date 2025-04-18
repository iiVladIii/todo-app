const request = require('supertest');
const express = require('express');
const authRouter = require('./authRoutes');
const authController = require('../controllers/authController/authController');

jest.mock('../controllers/authController/authController');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Router', () => {
    beforeEach(() => {
        authController.register.mockClear();
        authController.login.mockClear();
    });

    describe('POST /auth/register', () => {
        it('should call authController.register', async () => {
            const mockRegister = jest.fn((req, res) => res.status(201).send());
            authController.register.mockImplementation(mockRegister);

            await request(app)
                .post('/auth/register')
                .send({ username: 'testuser', password: 'testpass' })
                .expect(201);

            expect(authController.register).toHaveBeenCalledTimes(1);
            expect(authController.register).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Function)
            );
        });
    });

    describe('POST /auth/login', () => {
        it('should call authController.login', async () => {
            const mockLogin = jest.fn((req, res) => res.status(200).send());
            authController.login.mockImplementation(mockLogin);

            await request(app)
                .post('/auth/login')
                .send({ username: 'testuser', password: 'testpass' })
                .expect(200);

            expect(authController.login).toHaveBeenCalledTimes(1);
            expect(authController.login).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                expect.any(Function)
            );
        });
    });
});
