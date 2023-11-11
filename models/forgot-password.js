const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const forgotPasswordSchema = new Schema( {
    active: {
        type: Boolean
    },
    expires: {
        type: Date
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Forgetpassword', forgotPasswordSchema);

