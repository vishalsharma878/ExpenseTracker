const Sequelize = require('sequelize');

const sequelize = require('../utils/databasePath');

const User = sequelize.define('expense', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    expenseAmount:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull:false
       
    }
})

module.exports = User;
