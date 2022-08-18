const mongoose = require('mongoose')
const Schema = mongoose.Schema
const accountSchema = new Schema({
    email:{
        type: String,
        unique: true
    },
    username: String,
    fullname: String,
    avatar: String,
    phone:{
        type: String,
        unique: true
    },
    password: String,
    address: String,
    birthday: String,
    idCardFront: String,
    idCardBack: String,
    //status 0: unverified, 1: verified, 2: waiting for an update, 3: disabled 4: locked
    status:{
        type: Number,
        default: 0
    },
    // Check first login | true is login first, false is the opposite case
    firstLogin:{
        type: Boolean,
        default: true
    },
    //Role: user|admin
    role:{
        type: String,
        default: 'user'
    },
    countFailLogin:{
        type: Number,
        defaul: 0
    },
    // Time wait login
    timeWait:{
        type: Date
    },
    // Unusual login
    unusualLogin:{
        type: Number,
        default: 0
    },
    //Money in account
    money:{
        type: Number,
        default: 0
    }


},{timestamps: true})
module.exports = mongoose.model('account',accountSchema)