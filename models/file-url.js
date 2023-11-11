const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expensesUrl = new Schema( {
    url: {
       type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})
module.exports = mongoose.model('Url', expensesUrl);