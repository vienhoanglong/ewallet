require('dotenv').config();
const { connectDB } = require('./config/db.config')
connectDB()
const express = require('express')
const cors = require('cors')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const socketio = require('socket.io')
const accountRouter = require('./routers/account.router')
const userRouter = require('./routers/user.router')
const adminRouter = require('./routers/admin.router')
const app = express()
app.use(flash())
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'vhlong', saveUninitialized: true, resave: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', accountRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/404', (req, res)=>{
    res.render('error-page')
})
app.use('/profile', (req, res) =>{
    res.render('profile')
})
const port = process.env.PORT || 3000
const httpServer = app.listen(port, () => {
    console.log('http://localhost:' + port)
})
let io = socketio(httpServer)
var users = {}

io.on('connection', (socket) => {
    // socket.on('disconnect', () => {
    //     console.log('user with ID: ',socket.id + 'disconnect')
    // })
    socket.on('connected', (userId) => {
        socket.userId = userId
        users[userId] = socket
    })
    //Socket Notification-transfer
    socket.on('Notification-transfer', (data) => {
        const to = data.receiverId
        const text = data.text
        if (users.hasOwnProperty(to)) {
            users[to].emit('Notification-transfer', {
                textTitle: text
            })
        }
    })
    //Socket Send Notification
    socket.on("Send-Notification", (data) =>{
        socket.broadcast.emit("Send-Notification", data)
    })
})