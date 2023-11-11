const Razorpay = require('razorpay');
const User = require('../models/user');

const Order = require('../models/purchase');

const purchasePremimum = async (req, res) => {
    try {
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET_KEY
        })

        const amount = 3500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err));
                
            }
            Order.create({orderId: order.id, status: 'PENDING', userId: req.user._id}).then(() =>{
                return res.status(201).json({order, key_id : rzp.key_id})});
        }).catch(err => {
            throw new Error("Razorpay Error: "+ err)
        })

    }catch(err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

const updateStatus = async (req, res) => {
        const {payment_id, order_id}  = req.body;
        try {
            const order = await Order.findOne({ orderId: order_id });
        
            if (!order) {
                 return res.status(404).json({ success: false, message: "Order not found" });
                 
            }
        
            const updateOrderPromise = order.updateOne({ paymentId: payment_id, status: 'SUCCESSFUL' });
            const updateUserPromise = req.user.updateOne({ isPremiumUser: true });
        
            await Promise.all([updateOrderPromise, updateUserPromise]);
            
            return res.status(202).json({ success: true, message: "Transaction Successful" });
        } catch (err) {
            return res.status(500).json(err);
        }
        
}

const checkStatus = (req, res) => {
    User.findOne({isPremiumUser: true, _id: req.user._id})
    .then((user) => {
        res.json(user)
    })
    .catch (err => {
        console.log(err)
        res.status(500).json({ message: 'Internal server error', error: err });
    })
}

module.exports ={
    purchasePremimum,
    updateStatus,
    checkStatus
}