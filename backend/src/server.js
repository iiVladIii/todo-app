require('./utils/env');
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
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
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

sequelize
    .sync()
    .then(() => {
        app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => console.error('Unable to connect to the database:', err));
