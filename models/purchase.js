const Sequelize = require('sequelize');
const sequelize = require('../utils/databasePath');

const purchase = sequelize.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentId: Sequelize.STRING,
    orderId: Sequelize.STRING,
    status: Sequelize.STRING
})

module.exports = purchase;