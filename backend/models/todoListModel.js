const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./userModel');

const TodoList = sequelize.define('TodoList', {
    name: {
        type: DataTypes.STRING,
        defaultValue: 'Default List',
    },
});

TodoList.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(TodoList, { foreignKey: 'userId' });

module.exports = TodoList;
