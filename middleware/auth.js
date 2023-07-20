const jwt = require("jsonwebtoken");
const User = require("../model/users");

exports.athenticate = async (req,res,next) => {
    try{
        const token = req.header("Authorization");
        const userObj = jwt.verify(token, process.env.USER_TOKAN_KEY);
        if(!userObj) {
            throw new Error("null")
        }
        console.log("userid >>>>", userObj.userId);
        const user = await User.findByPk(userObj.userId);
        req.user = user;
        next();
    }
    catch(err) {
        console.log(err);
        res.status(500).json();
    }
}
