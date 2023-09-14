const Sequelize = require('sequelize');

const sequelize = require('../utils/databasePath');

const user  = sequelize.define('users', {
    id:{
       type: Sequelize.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       alowNull: false
    },
    name:{
       type: Sequelize.STRING,
       alowNull: false, 
    },
    email:{
       type: Sequelize.STRING,
       alowNull: false,
       unique: true
    },
    password:{
        type: Sequelize.STRING,
        alowNull: false
    },
     isPremiumUser:Sequelize.BOOLEAN

});

module.exports = user;