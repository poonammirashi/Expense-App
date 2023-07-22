const express=require("express");
const bodyparser = require("body-parser");
const helmet = require("helmet");
const morgan = require('morgan');
const fs = require('fs');

const app = express();

require('dotenv').config();

const path = require("path")
const cors = require('cors');

const User = require('./model/users')
const Expense = require("./model/expense");
const Order = require('./model/order');
const resetForgotPassword = require('./model/forgotPasswordRequests');
const fileUrl = require('./model/uplodedFiles');

const filestream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(cors());
app.use(helmet.xssFilter());
app.use(morgan('combined', {stream : filestream}));
// app.use(helmet.noSniff());

const sequelize = require("./database");
const userroute =require('./routes/user');
const expenseroute = require("./routes/expense");
const premiummembership = require("./routes/purchase");
const forgotPassword = require("./routes/forgotPassword");

app.use(bodyparser.json({extended:false}));

app.use("/user",userroute);
app.use("/user/expense",expenseroute);
app.use("/user/purchase",premiummembership);
app.use("/password", forgotPassword);

app.use((req,res) => {
    console.log(req.url)
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(resetForgotPassword);
resetForgotPassword.belongsTo(User);

User.hasMany(fileUrl);
fileUrl.belongsTo(User);

sequelize
.sync()
.then(result => {
    app.listen(process.env.PORT_NUMBER || 3000,console.log("app is listening"))
}).catch(err => console.log(err));
