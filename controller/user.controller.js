const sendMail = require('../config/sendmail.config')
const account = require('../models/accounts')
const transaction = require('../models/transactions')
const generator = require('generate-password')
const { findById } = require('../models/accounts')
exports.home = async (req, res) => {
    let id = req.session.account._id
    let username = req.session.account.username
    let topUp = await transaction.find({$and:[{username: username, typeTransaction: 0, statusTransaction: 0}]}).count()
    let transfer = await transaction.find({$and:[{username: username, typeTransaction: 1, "statusTransaction":{$in:[0,2]}}]}).count()
    let withdraw = await transaction.find({$and:[{username: username, typeTransaction: 2, "statusTransaction":{$in:[0,2]}}]}).count()
    let buyCard = await transaction.find({$and:[{username: username, typeTransaction: 3, statusTransaction: 0}]}).count()
    let getMoney = await transaction.find({$and:[{username: username, typeTransaction: 4, "statusTransaction":{$in:[0,2]}}]}).count()
    let acc = await account.findById(id)
    if(acc){
        if(acc.status=== 0){
            return res.render('unactivated', {
                namePage: 'Home', 
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar
            })
        }else{
            return res.render('home', {
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar,
                status: acc.status,
                dataChart: {topUp,transfer, withdraw, buyCard, getMoney}
            })
        }
    }

}
exports.getTopUp = async (req, res) => {
    let id = req.session.account._id
    let acc = await account.findById(id)
    if(acc){
        if(acc.status=== 0){
            return res.render('unactivated', {
                namePage: 'Top up',
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar
            })
        }else{
            return res.render('top-up', {
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar,
                status: acc.status
            })
        }
    }
}
const topUp = async (id, username, money) => {
    await account.findByIdAndUpdate(id, {
        $inc: { money: money }
    }).then(() => {
        let history = new transaction({
            username: username,
            money: money,
            typeTransaction: 0,
            statusTransaction: 0

        })
        return history.save()
    })

}
exports.postTopUp = async (req, res) => {
    let id = req.session.account._id
    let username = req.session.account.username
    let { card_num, expiry_date, cvv, money } = req.body
    money = parseInt(money)
    if (card_num === '111111') {
        if (expiry_date === '2022-10-10') {
            if (cvv === '411') {
                topUp(id, username, money).then(() => {
                    return res.json({ success: true, message: 'Top up successfully.' })
                }).catch((err) => {
                    return res.json({ success: false, message: err })
                })
            } else {
                return res.json({ success: false, message: 'CVV is not valid' })
            }
        } else {
            return res.json({ success: false, message: 'Expiry date is not valid.' })
        }
    } else if (card_num === '222222') {
        if (expiry_date === '2022-11-11') {
            if (cvv === '443') {
                if (money <= 1000000) {
                    topUp(id, username, money).then(() => {
                        return res.json({ success: true, message: 'Top up successfully.' })
                    }).catch((err) => {
                        return res.json({ success: false, message: err })
                    })
                } else {
                    return res.json({ success: false, message: 'Can only be topped up to 1 million.' })
                }
            } else {
                return res.json({ success: false, message: 'CVV is not valid.' })
            }
        } else {
            return res.json({ success: false, message: 'Expiry date is not valid.' })

        }
    } else if (card_num === '333333') {
        if (expiry_date === '2022-12-12') {
            if (cvv === '577') {
                return res.json({ success: true, message: 'Card is out of money.' })
            } else {
                return res.json({ success: false, message: 'CVV is not valid' })
            }
        } else {
            return res.json({ success: false, message: 'Expiry date is not valid' })
        }
    } else {
        return res.json({ success: false, message: 'This card is not supported.' })

    }

}
exports.getWithdraw = async (req, res) => {
    let id = req.session.account._id
    let acc = await account.findById(id)
    if(acc){
        if(acc.status=== 0){
            return res.render('unactivated', {
                namePage: 'Withdraw',
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar
            })
        }else{
            return res.render('withdraw', {
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                status: acc.status,
                avatar: acc.avatar
            })
        }
    }
}
const withdraw = async (id, username, money, fee, note, status) => {
    if (status === 'under5tr') {
        let moneyfee = parseInt(money + fee)
        await account.findByIdAndUpdate(id, {
            $inc: { money: - moneyfee }
        }).then(() => {
            let history = new transaction({
                username: username,
                money: money,
                typeTransaction: 2,
                statusTransaction: 0,
                fee: fee,
                note: note
            })
            return history.save()
        })
    }
    if (status === 'over5tr') {
        let history = new transaction({
            username: username,
            money: money,
            typeTransaction: 2,
            statusTransaction: 2,
            fee: fee,
            note: note
        })
        return history.save()
    }
}
exports.postWithdraw = async (req, res) => {
    let id = req.session.account._id
    let username = req.session.account.username
    let { card_num, expiry_date, cvv, money, note } = req.body
    money = parseInt(money)
    const timeNow = new Date()
    let timeCurrent = String(timeNow.getDate() + '-' + (timeNow.getMonth() + 1) + '-' + timeNow.getFullYear())
    account.findById(id, (err, data) => {
        transaction.find({
            $and: [{
                typeTransaction: 2, timeCreate: {
                    $regex: timeCurrent
                }
            }]
        }).count().then(limitWithdraw => {
            if (limitWithdraw > 1) {
                return res.json({ success: false, message: 'Only 2 withdrawal transactions are allowed per day.' })
            } else {
                if (card_num === '111111') {
                    if (expiry_date === '2022-10-10') {
                        if (cvv === '411') {
                            if (money > data.money) {
                                return res.json({ success: false, message: 'Not enough balance.' })
                            } else if (money % 50 != 0) {
                                return res.json({ success: false, message: 'The withdrawal amount must be a multiple of 50.' })
                            } else if (money >= 5000000) {
                                withdraw(id, username, money, money * 0.05, note, 'over5tr').then(() => {
                                    return res.json({ success: true, message: 'Waiting for approval.' })
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                            } else {
                                withdraw(id, username, money, money * 0.05, note, 'under5tr').then(() => {
                                    return res.json({ success: true, message: 'Withdraw successfully.' })
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                            }
                        } else {
                            return res.json({ success: false, message: 'CVV is not valid' })
                        }
                    } else {
                        return res.json({ success: false, message: 'Expiry date is not valid.' })
                    }
                } else {
                    return res.json({ success: false, message: 'This card is not supported.' })
                }
            }
        }).catch(err => {
            return res.json({ success: false, message: err })
        })
    })
}
exports.getBuyCard = async (req, res) => {
    let id = req.session.account._id
    let acc = await account.findById(id)
    if(acc){
        if(acc.status=== 0){
            return res.render('unactivated', {
                namePage: 'Buy card',
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar
            })
        }else{
            return res.render('buy-card', {
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                status: acc.status,
                avatar: acc.avatar
            })
        }
    }
}
const createCardValue = (supplier, quanlity) => {
    let codeCard = []

    while (codeCard.length < quanlity) {
        let data = generator.generate({
            length: 5,
            numbers: true,
            uppercase: false,
            exclude: "qwertyuiopasdfghjklzxcvbnm"
        })
        let code = supplier + data.toString()
        codeCard.push(code)
    }
    return codeCard
}
const buyCard = async (id, username, moneyTotal, telecomCard, supplier, priceCard, quanlity) => {
    let codeCard = createCardValue(supplier, quanlity)
    await account.findByIdAndUpdate(id, {
        $inc: { money: -moneyTotal }
    }).then(() => {
        let history = new transaction({
            username: username,
            money: moneyTotal,
            typeTransaction: 3,
            statusTransaction: 0,
            fee: 0,
            codeCard: codeCard,
            telecomCard: telecomCard,
            priceCard: priceCard
        })
        return history.save()
    })
}
exports.postBuyCard = async (req, res) => {
    let id = req.session.account._id
    let username = req.session.account.username
    let { telecomCard, priceCard, quanlity } = req.body
    const moneyTotal = parseInt(priceCard * quanlity)
    account.findById(id, (err, data) => {
        if (telecomCard === 'Viettel') {
            if (quanlity > 5) {
                return res.json({ success: false, message: 'Number of cards should not be more than 5.' })
            } else {
                if (priceCard * quanlity > data.money) {
                    return res.json({ success: false, message: 'Not enough balance.' })
                } else {
                    buyCard(id, username, moneyTotal, telecomCard, '111111', priceCard, quanlity).then(() => {
                        return res.json({ success: true, message: 'Buy card successfully.' })
                    })
                }
            }
        } else if (telecomCard === 'Mobifone') {
            if (priceCard * quanlity > data.money) {
                return res.json({ success: false, message: 'Not enough balance.' })
            } else {
                buyCard(id, username, moneyTotal, telecomCard, '222222', priceCard, quanlity).then(() => {
                    return res.json({ success: true, message: 'Buy card successfully.' })
                })
            }
        } else if (telecomCard === 'Vinaphone') {
            if (priceCard * quanlity > data.money) {
                return res.json({ success: false, message: 'Not enough balance.' })
            } else {
                buyCard(id, username, moneyTotal, telecomCard, '333333', priceCard, quanlity).then(() => {
                    return res.json({ success: true, message: 'Buy card successfully.' })
                })
            }
        } else {
            return res.json({ success: false, message: 'This supplier does not exist.' })
        }
    })
}
exports.getTransfer = async (req, res) => {
    let id = req.session.account._id
    let acc = await account.findById(id)
    if(acc){
        if(acc.status=== 0){
            return res.render('unactivated',{
                namePage: 'Transfer',
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar
        })
        }else{
            return res.render('transfer', {
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                status: acc.status,
                avatar: acc.avatar
            })
        }
    }
}
exports.postCheckPhone = async (req, res) => {
    let { phoneTransfer } = req.body
    let yourPhone = req.session.account.phone
    try {
        if (phoneTransfer !== yourPhone) {
            let user = await account.findOne({ phone: phoneTransfer })
            if (user) {
                return res.json({ success: true, message: 'check phone successfully', data: user })
            } else {
                return res.json({ success: false, message: 'Recipient not found!.' })
            }
        } else {
            return res.json({ success: false, message: 'Can not transfer money to my own account.' })
        }
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}
let timeOTPSend
let codeOTP
let timeOTPCurrent
exports.postSendOTP = async (req, res) => {
    let { phone, money, feeTransfer } = req.body
    const id = req.session.account._id
    money = parseInt(money)
    let fee = money * 0.05
    let moneyTransfer = money + fee
    try {
        let balance = await account.findOne({ _id: id }).distinct('money')
        balance = parseInt(balance)
        if (feeTransfer === 'sender') {
            if (balance < moneyTransfer) {
                return res.json({ success: false, message: '1Your balance is not enough to make a transaction.' })
            } else {
                let user = await account.findOne({ phone: phone })
                if (user) {
                    timeOTPSend = new Date().getTime()
                    codeOTP = generator.generate({
                        length: 5,
                        numbers: true,
                        uppercase: false,
                        exclude: "qwertyuiopasdfghjklzxcvbnm"
                    })
                    sendMail(user.email, 'Send OTP verify transfer', `OTP code: ${codeOTP}`)
                    return res.json({ success: true, message: 'OTP Sent to your email, please enter OTP to confirm the transaction.' })
                } else {
                    return res.json({ success: false, message: 'Recipient not found.' })
                }
            }
        } else {
            if (balance < money) {
                return res.json({ success: false, message: '2Your balance is not enough to make a transaction.' })
            } else {
                let user = await account.findOne({ phone: phone })
                if (user) {
                    timeOTPSend = new Date().getTime()
                    codeOTP = generator.generate({
                        length: 5,
                        numbers: true,
                        uppercase: false,
                        exclude: "qwertyuiopasdfghjklzxcvbnm"
                    })
                    sendMail(user.email, 'Send OTP verify transfer', `OTP code: ${codeOTP}`)
                    return res.json({ success: true, message: 'OTP Sent to your email, please enter OTP to confirm the transaction.' })
                } else {
                    return res.json({ success: false, message: 'Recipient not found.' })
                }
            }
        }

    } catch (error) {
        return res.json({ success: false, message: error })
    }
}
exports.postTransfer = async (req, res) => {
    const id = req.session.account._id
    let { phonRecipient, moneyTransfer, noteTransfer, feeTransfer, OTP } = req.body
    timeOTPCurrent = new Date().getTime()
    moneyTransfer = parseInt(moneyTransfer)
    let time = new Date().toISOString()
    let moneyAndFee = moneyTransfer * 0.05
    let money = moneyTransfer + moneyAndFee
    let moneySubtractFee = moneyTransfer - moneyAndFee
    let checkTimeOTP = (timeOTPCurrent - timeOTPSend) / 1000
    try {
        if (OTP === codeOTP && checkTimeOTP < 61) {
            let receiver = await account.findOne({ phone: phonRecipient })
            let sender = await account.findOne({ _id: id })
            if (receiver) {
                if (moneyTransfer <= 5000000) {
                    console.log("Under 5tr")
                    if (feeTransfer === 'sender') {
                        try {
                            let updateMoneySender = await account.findOneAndUpdate({ username: sender.username }, { $inc: { money: -money } })
                            let updateMoneyReceiver = await account.findOneAndUpdate({ username: receiver.username }, { $inc: { money: moneyTransfer } })
                            if (updateMoneySender && updateMoneyReceiver) {
                                let historySender = new transaction({
                                    username: sender.username,
                                    money: moneyTransfer,
                                    typeTransaction: 1,
                                    statusTransaction: 0,
                                    note: noteTransfer,
                                    fee: moneyAndFee,
                                    payId: feeTransfer
                                })
                                historySender.save().then(() => {
                                    sendMail(sender.email, 'Notification Transfer', `You just transferred ${moneyTransfer} \nto: ${receiver.fullname}\ndate: ${time}`)
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                                let historyReceiver = new transaction({
                                    username: receiver.username,
                                    money: moneyTransfer,
                                    typeTransaction: 4,
                                    statusTransaction: 0,
                                    noteTransfer: noteTransfer,
                                    fee: 0,
                                    payId: feeTransfer
                                })
                                historyReceiver.save().then(() => {
                                    // Send mail 
                                    sendMail(receiver.email, 'Notification Transfer', `Your account just received:\n${moneyTransfer}\nTransaction fee: 0 \nFrom:${sender.fullname}\nDay trading: ${time}`)
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                                return res.json({ success: true, message: 'Transfer successfully.', data: { receiverId: receiver._id, text: `You just received money from ${sender.fullname}` } })
                            } else {
                                return res.json({ success: false, message: 'Error updating transferor balance.' })
                            }
                        } catch (error) {
                            return res.json({ success: false, message: error })
                        }
                    } else {
                        try {
                            let updateMoneySender = await account.findOneAndUpdate({ username: sender.username }, { $inc: { money: -moneyTransfer } })
                            let updateMoneyReceiver = await account.findOneAndUpdate({ username: receiver.username }, { $inc: { money: moneySubtractFee } })
                            if (updateMoneySender && updateMoneyReceiver) {
                                let historySender = new transaction({
                                    username: sender.username,
                                    money: moneyTransfer,
                                    typeTransaction: 1,
                                    statusTransaction: 0,
                                    note: noteTransfer,
                                    fee: 0,
                                    payId: feeTransfer
                                })
                                historySender.save().then(() => {
                                    sendMail(sender.email, 'Notification Transfer', `You just transferred ${moneyTransfer} \nto: ${receiver.fullname}\ndate: ${time}`)
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                                let historyReceiver = new transaction({
                                    username: receiver.username,
                                    money: moneyTransfer,
                                    typeTransaction: 4,
                                    statusTransaction: 0,
                                    noteTransfer: noteTransfer,
                                    fee: moneyAndFee,
                                    payId: feeTransfer
                                })
                                historyReceiver.save().then(() => {
                                    // Send mail 
                                    sendMail(receiver.email, 'Notification Transfer', `Your account just received:\n${moneyTransfer}\nTransaction fee: ${moneyAndFee} \nFrom:${sender.fullname}\nDay trading: ${time}`)
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                                return res.json({ success: true, message: 'Transfer successfully.', data: { receiverId: receiver._id, text: `You just received money from ${sender.fullname}` } })
                            } else {
                                return res.json({ success: false, message: 'Error updating transferor balance.' })
                            }
                        } catch (error) {
                            return res.json({ success: false, message: error })
                        }
                    }

                } else {
                    console.log("Over 5tr")
                    if (feeTransfer === 'sender') {
                        try {
                            let updateMoneySender = await account.findOneAndUpdate({ username: sender.username }, { $inc: { money: -money } })
                            if (updateMoneySender) {
                                let historySender = new transaction({
                                    username: sender.username,
                                    money: moneyTransfer,
                                    typeTransaction: 1,
                                    statusTransaction: 2,
                                    note: noteTransfer,
                                    fee: moneyAndFee,
                                    payId: feeTransfer,
                                    idReceiver: receiver._id
                                })
                                historySender.save().then(() => {
                                    sendMail(sender.email, 'Notification Transfer', `You just transferred ${moneyTransfer} \nTo: ${receiver.fullname}\ndate: ${time} \nStatus: waiting admin accept transfer.`)
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                                return res.json({ success: true, message: 'The money transfer is successful, the transaction is in the waiting state, waiting for approval.', data: { receiverId: receiver._id, text: `You just received money from ${sender.fullname}. Status is pending approval from admin!!!` } })
                            } else {
                                return res.json({ success: false, message: 'Error updating transferor balance.' })
                            }
                        } catch (error) {
                            return res.json({ success: false, message: error })
                        }
                    } else {
                        try {
                            let updateMoneySender = await account.findOneAndUpdate({ username: sender.username }, { $inc: { money: -moneyTransfer } })
                            if (updateMoneySender) {
                                let historySender = new transaction({
                                    username: sender.username,
                                    money: moneyTransfer,
                                    typeTransaction: 1,
                                    statusTransaction: 0,
                                    note: noteTransfer,
                                    fee: 0,
                                    payId: feeTransfer
                                })
                                historySender.save().then(() => {
                                    sendMail(sender.email, 'Notification Transfer', `You just transferred ${moneyTransfer} \nto: ${receiver.fullname}\ndate: ${time} \nStatus: waiting admin accept transfer`)
                                }).catch(err => {
                                    return res.json({ success: false, message: err })
                                })
                                return res.json({ success: true, message: 'The money transfer is successful, the transaction is in the waiting state, waiting for approval.', data: { receiverId: receiver._id, text: `You just received money from ${sender.fullname}. Status is pending approval from admin!!!` } })
                            } else {
                                return res.json({ success: false, message: 'Error updating transferor balance.' })
                            }
                        } catch (error) {
                            return res.json({ success: false, message: error })
                        }
                    }
                }
            } else {
                return res.json({ success: false, message: 'Recipient not found!.' })
            }
        } else {
            return res.json({ success: false, message: 'OTP code is incorrect or expired.' })
        }
    } catch (error) {
        return res.json({ success: false, message: error })
    }


}
exports.getHistory = async (req, res) => {
    let id = req.session.account._id
    let username = req.session.account.username
    let { selectHistory } = req.query
    let acc = await account.findById(id)
    if(acc){
        if(acc.status=== 0){
            return res.render('unactivated', {
                namePage: 'History',
                id: acc._id,
                fullname: acc.fullname,
                email: acc.email,
                username: acc.username,
                phone: acc.phone,
                address: acc.address,
                birthday: acc.birthday,
                idCardFront: acc.idCardFront,
                idCardBack: acc.idCardBack,
                money: acc.money,
                avatar: acc.avatar
            })
        }else{
            if (selectHistory) {
                if(selectHistory === 'buyCard'){
                    let history = await transaction.find({$and:[{username: username, typeTransaction: 3}]}).sort({ 'timeCreate': -1})
                    return res.json({success: true, data: history})
                }else if(selectHistory === 'transfer'){
                    let history = await transaction.find({$and:[{username: username, typeTransaction: 1}]}).sort({ 'timeCreate': -1})
                    return res.json({success: true, data: history})
                }else if(selectHistory === 'topUp'){
                    let history = await transaction.find({$and:[{username: username, typeTransaction: 0}]}).sort({ 'timeCreate': -1})
                    return res.json({success: true, data: history})
                }else if(selectHistory === 'withdraw'){
                    let history = await transaction.find({$and:[{username: username, typeTransaction: 2}]}).sort({ 'timeCreate': -1})
                    return res.json({success: true, data: history})
                }else if(selectHistory === 'getMoney'){
                    let history = await transaction.find({$and:[{username: username, typeTransaction: 4}]}).sort({ 'timeCreate': -1})
                    return res.json({success: true, data: history})
                }else{
                    let history = await transaction.find({username: username}).sort({ 'timeCreate': -1})
                    return res.json({success: true, data: history})
                }
            } else {
                let history = await transaction.find({ username: username }).sort({ 'timeCreate': -1 })
                return res.render('history', { 'history': history })
            }
        }
    }
}
exports.getDetailHistory = async(req, res) =>{
    let id = req.params.id
    transaction.findById(id, function(err, data) {
        return res.json({success: true, data})
    })
}
exports.listChat = async(req, res) =>{
    res.render('list-chat')
}
exports.chat = async(req, res) =>{
    res.render('chat')
}