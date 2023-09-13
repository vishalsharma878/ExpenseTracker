const Razorpay = require('razorpay');

const Order = require('../models/purchase');

const purchasePremimum = async (req, res) => {
    try {
        let rzp = new Razorpay({
            key_id: 'rzp_test_vl3cRPDGxtyDfE',
            key_secret: 'CPDqZLnKHPE8drpdq7YfMqdC'
        })

        const amount = 3500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err){
                throw new Error(JSON.stringify(err));
                
            }
            req.user.createOrder({orderId: order.id, status: 'PENDING'}).then(() =>{
                console.log("oooo "+order.razorpay_payment_id);
                return res.status(201).json({order, key_id : rzp.key_id})});
        }).catch(err => {
            throw new Error(err)
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

module.exports ={
    purchasePremimum,
    updateStatus
}