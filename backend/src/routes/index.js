const express = require('express');
const { httpRequestCounter } = require('../metrics/metrics');
const authRoutes = require('./authRoutes');
const metricsRoutes = require('./metricsRoutes');
const todoRoutes = require('./todoRoutes');

const router = express.Router();

router.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            path: req.route ? req.route.path : req.path,
            status: res.statusCode,
        });
    });
    next();
});

router.use(metricsRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/todos', todoRoutes);

module.exports = router;
