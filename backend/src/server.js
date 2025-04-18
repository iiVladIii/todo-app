require('./utils/env');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const routes = require('./routes');

const { port } = require('./config/config');

const app = express();

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use('/', routes);
console.log('hello');
sequelize
    .sync()
    .then(() => {
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => console.error('Unable to connect to the database:', err));
