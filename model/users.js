const Sequelize = require('sequelize');

const sequelize = require("../database");

const user = sequelize.define("user", {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    name : {
        type : Sequelize.STRING,
        allowNull:false 
    },
    email : {
      type : Sequelize.STRING,
      allowNull : false
    },
    password : {
        type :Sequelize.STRING,
        allowNull : false 
    },
    isPremier : Sequelize.BOOLEAN,
    total_expense : {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})

module.exports = user