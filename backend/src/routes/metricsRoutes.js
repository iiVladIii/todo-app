const express = require('express');
const router = express.Router();
const { register, httpRequestCounter } = require('../metrics/metrics');

router.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

module.exports = router;
