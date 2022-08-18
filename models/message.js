const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from_id:{
        type: String,
        required: true
    },
    des_id: {
        type: String,
        required: true
    },
    msg: {
        type: String
    }
}, {timestamps: true});

const Message = mongoose.model('message', messageSchema);


module.exports = Message;