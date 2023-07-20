const Sequelize = require('sequelize');
const sequelize = require('../database');


forgotPasswordRequests = sequelize.define('forgotpassword',{
    id: {
        type:Sequelize.UUID,
        primaryKey: true,
        allowNull: false 
    },
    isActive:Sequelize.BOOLEAN
});

module.exports = forgotPasswordRequests ;