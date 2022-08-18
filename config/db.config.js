const mongoose = require('mongoose')
const connectDB = async () =>{
    try{
        const conn = await mongoose.connect("mongodb+srv://vienhoanglong:NmH3KBwqdCWYa5aY@cluster0.oofvr.mongodb.net/e-wallet?retryWrites=true&w=majority",{
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