const mongoose = require('mongoose')
const Schema = mongoose.Schema
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:'account'
    },
    token:{
        type: String,
        required: true
    },
    createAt:{
        type: Date, expires: '60s', default: Date.now 
    }
})
module.exports = mongoose.model('token', tokenSchema)