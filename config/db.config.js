const mongoose = require('mongoose')
const connectDB = () =>{
    try{
        mongoose.connect(process.env.CONNECT_DB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log('DB connection successfully')
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}
module.exports = {connectDB}