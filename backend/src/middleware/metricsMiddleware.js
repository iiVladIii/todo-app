const { httpRequestCounter } = require('../metrics/metrics');

const metricsMiddleware = (req, res, next) => {
    console.log(req, res);
    res.on('finish', () => {
        const route = req.route ? req.route.path : req.path;
        console.log(
            `Request received: method=${req.method}, path=${route}, status=${res.statusCode}`
        );
        httpRequestCounter.inc({
            method: req.method,
            path: route,
            status: res.statusCode,
        });
    });
    next();
};

module.exports = metricsMiddleware;
