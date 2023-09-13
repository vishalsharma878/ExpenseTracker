const Sequelize = require('sequelize');

const sequelize = new Sequelize('expensedata', 'root', 'Restin@2137', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;