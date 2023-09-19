const Sequelize = require('sequelize');

const sequelize = require('../utils/databasePath');

const expensesUrl = sequelize.define('fielUrl', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    url: Sequelize.STRING,
    
})
module.exports = expensesUrl;