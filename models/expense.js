const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema( {
    expenseAmount:{
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
       
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }    
})

module.exports = mongoose.model('Expense', expenseSchema);
