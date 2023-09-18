const Sequelize = require('sequelize');

const sequelize = require('../utils/databasePath');

const forgotPassword = sequelize.define('ForgotPasswordRequests', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expires: Sequelize.DATE
})

module.exports = forgotPassword;

