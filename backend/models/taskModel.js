const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const TodoList = require('./todoListModel');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

Task.belongsTo(TodoList, { foreignKey: 'listId' });
TodoList.hasMany(Task, { foreignKey: 'listId' });

module.exports = Task;
