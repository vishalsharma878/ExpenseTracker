const Razorpay = require('razorpay');
const User = require('../models/user');

const Order = require('../models/purchase');

const purchasePremimum = async (req, res) => {
    try {
        let rzp = new Razorpay({
            key_id: 'rzp_test_fbEp6CfftylrQp',
            key_secret: 'YAd9mOqKVdTOlpb9qUfFuOGS'
        })

        const amount = 3500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err));
                
            }
            req.user.createOrder({orderId: order.id, status: 'PENDING'}).then(() =>{
                return res.status(201).json({order, key_id : rzp.key_id})});
        }).catch(err => {
            throw new Error("Eroskmd "+ err)
        })

    }catch(err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

const updateStatus = async (req, res) => {
        const {payment_id, order_id}  = req.body;
        try {
            const order = await Order.findOne({ where: { orderId: order_id } });
        
            if (!order) {
                 return res.status(404).json({ success: false, message: "Order not found" });
                 
            }
        
            const updateOrderPromise = order.update({ paymentId: payment_id, status: 'SUCCESSFUL' });
            const updateUserPromise = req.user.update({ isPremiumUser: true });
        
            await Promise.all([updateOrderPromise, updateUserPromise]);
            
            return res.status(202).json({ success: true, message: "Transaction Successful" });
        } catch (err) {
            return res.status(500).json(err);
        }
        
}

const checkStatus = (req, res) => {
    User.findOne({where: {isPremiumUser: true, id: req.user.id}})
    .then((user) => res.json(user))
    .catch (err => {
        res.status(500).json({ message: 'Internal server error', error: err });
    })
}

module.exports ={
    purchasePremimum,
    updateStatus,
    checkStatus
}