const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('./authMiddleware'); // Update with the correct path

const app = express();
app.use(authenticateJWT);
app.get('/protected', (req, res) => {
    res.status(200).json({ message: 'Success', user: req.user });
});

describe('authenticateJWT Middleware', () => {
    let token;
    const jwtSecret = 'yourSecretKey'; // Replace with your actual secret key

    beforeAll(() => {
        process.env.JWT_SECRET = jwtSecret; // Set the process environment variable
        token = jwt.sign({ username: 'testUser' }, jwtSecret, {
            expiresIn: '1h',
        });
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/protected');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access token is missing');
    });

    it('should return 403 if token is invalid', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'Bearer invalidToken');
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Invalid token');
    });

    it('should allow access to protected route with valid token', async () => {
        const response = await request(app)
            .get('/protected')
            .set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Success');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.username).toBe('testUser');
    });
});
