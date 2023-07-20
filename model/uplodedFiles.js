const Sequelize = require("sequelize");
const sequelize = require("../database");

const fileUrl = sequelize.define("urlfile", {
    id:{
        type : Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
    },
    url:Sequelize.STRING,
    date:Sequelize.STRING
});

module.exports = fileUrl;