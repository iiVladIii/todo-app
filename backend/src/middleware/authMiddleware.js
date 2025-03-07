const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        console.log(jwtSecret);
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
