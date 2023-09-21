const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_NAME, 'root', process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;