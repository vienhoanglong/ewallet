const mongoose = require('mongoose')
const Schema = mongoose.Schema
const today = new Date()
const transactionSchema = new Schema({
    username: String,
    money:{
        type: Number, default: 0
    },
    //0: Top up |1: Transfer |2: Withdraw |3: Buy card |4: Get money
    typeTransaction:{
        type: Number
    },
    // 0: Success |1: Failed |2: Waiting
    statusTransaction:{
        type: Number
    },
    note: {
        type: String, default: ""
    },
    fee:{
        type:Number, default:0
    },
    codeCard: Array,
    telecomCard: String,
    priceCard: {type: Number},
    payId: String, //fee by
    idReceiver: String,
    timeCreate: { type: String, default:today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+' '
    +today.getHours()+":"+today.getMinutes()+":"+today.getSeconds()}
})
module.exports = mongoose.model('transaction', transactionSchema)