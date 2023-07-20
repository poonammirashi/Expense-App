const  Razorpay = require("razorpay");
const Order = require("../model/order");
const jwt = require("jsonwebtoken");
userServices = require("../services/usersServices");

exports.premiumPurchase = async (req,res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 1200;
        const order = await rzp.orders.create({amount, currency: "INR"});
        if(!order) {
            throw new Error(JSON.stringify(err));
        }
        const premiumUser = await req.user.createOrder({orderId : order.id, status : "Pending"})
        res.status(201).json({success: "true",order, key_id: rzp.key_id});
    } 
    catch(err) {
        console.log(err);
        res.status(403).json(err);
    }
}


exports.premiumPayment = async (req,res) => {
    try{
        const { order_id, payment_id } = req.body ;
        const p1 = await Order.findOne({where : {orderId : order_id}});
        const p2 = p1.update({status: "success", paymentId : payment_id});
        const p3 = req.user.update({isPremier: "true"});
        
        Promise.all([p2,p3]).then(()=>{
            return res.status(202).json({message:"successfull transaction", token: userServices.generateAccessToken(req.user.id,req.user.name,req.user.isPremier)});
    }).catch(err => console.log(err));
    
    }
    catch(err) {
        console.log(err)
        res.status(404).json(err);
    }

}

exports.premiumfails = async (req,res) => {
    try{
        const { order_id, payment_id} = req.body;
        const p1 = await Order.findOne({where : {orderId : order_id}});
        const p2 = p1.update({status: "failed", paymentId : payment_id});
        const p3 =req.user.update({isPremier: "false"});
        const [order, updateduser] = await Promise.all([p2,p3]);
        console.log(order,updateduser)
    }
    catch(err) {
        console.log(err)
        res.status(404).json(err);
    }

}