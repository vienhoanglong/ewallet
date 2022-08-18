const account = require('../models/accounts')
const notice = require('../models/notice')

exports.admin = async(req, res) =>{
    let id = req.session.account._id
    let acc = await account.findById(id)
    if(acc){
        return res.render('admin', {
            id: acc._id,
            username: acc.username,
            avatar: acc.avatar,
            fullname: acc.fullname
        })
    }
}
exports.postNotice = async(req, res) =>{
    let username = req.session.account.username
    let {title, description} = req.body
    try {
        if(title && description){
            let noti = new notice({
                author: username,
                title: title,
                description: description
            })
            noti.save().then(()=>{
                return res.json({ success: true, message: 'Post notice successfully!!', data: noti })
            }).catch(err =>{
                return res.json({ success: false, message: err })
            })
        }
    } catch (error) {
        return res.json({ success: false, message: error })
    }
}