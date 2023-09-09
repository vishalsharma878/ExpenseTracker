const Sequelize = require('sequelize');

const sequelize = require('../utils/databasePath');

const User = sequelize.define('expense', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    email:{
          type: Sequelize.STRING,
          allowNull: false,
    },
    expenseAmount:{
        type: Sequelize.STRING,
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
