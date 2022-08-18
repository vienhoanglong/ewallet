const mongoose = require('mongoose')
const Schema = mongoose.Schema
const notiSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    description: {
        type: String,
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
    img: {
        type: String,
        default: null,
    },
})
module.exports = mongoose.model('notice', notiSchema)