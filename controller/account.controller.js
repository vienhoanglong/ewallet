const sendMail = require('../config/sendmail.config')
const generator  = require('generate-password')
const bcrypt = require('bcrypt')
const path = require('path')
const multer = require('multer')
const crypto = require("crypto")
const { validationResult } = require('express-validator')
const account = require('../models/accounts')
const token = require('../models/token')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const checkFileType = (file, cb) => {
    const fileType = /jpg|jpeg|png/
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb(new Error("Only Image Support!"), false)
    }
}
const uploads = multer({
    storage: storage,
    //check file type
    fileFilter(req,file,cb){
        checkFileType(file,cb)
    }
})
exports.upload = uploads
exports.multipleUpload = uploads.fields([{name:'idCardFront'},{name:'idCardBack'}])

exports.getRegister = async(req, res) =>{
    let error = req.flash('errRegister')[0]
    let success = req.flash('successRegister')[0]
    if(error){
        res.render('register',{
            messageError: error.message,
            inputRegister: error.inputRegister
        })
    }else if(success){
        res.render('register',{
            messageSuccess: success.message
        })
    }else{
        res.render('register')
    }
}
exports.postRegister = async(req, res) =>{
    let result = validationResult(req)
    if(result.errors.length === 0){
        let {
            fullname, phone, address, birthday, email,
            idCardFront = req.files.idCardFront[0].originalname,
            idCardBack = req.files.idCardBack[0].originalname,
            password = generator.generate({
                length: 6,
                numbers:true
            }),
            username = generator.generate({
                length: 10,
                numbers: true,
                uppercase: false,
                exclude: "qwertyuiopasdfghjklzxcvbnm"
            }), 
            salt = 10
        } = req.body
        account.findOne({$or:[{email}, {phone}]})
        .then(acc=>{
            if(acc){
                req.flash('errRegister',{
                    message:"Email or phone number already exists",
                    registerInput:{fullname, phone, address, birthday, email, idCardFront, idCardBack}
                })
                res.redirect('/register')
                return;
            }
            // throw new Error('Email or phone number already exists')
        })
        .then(()=>bcrypt.hash(password, salt))
        .then(hashed =>{
            let accNew = new account({fullname, phone, address, birthday, email, idCardFront, idCardBack, username, password:hashed})
            return accNew.save() 
        }).then(()=>{
            console.log("username", username, "password", password)
            // Send mail
            sendMail(email, `E-Wallet new account', 'Your account has been created  \nUsername: ' ${username} '\nPassword: '${password}`)
            // Display alert-success
            req.flash('successRegister',{
                message: 'Create account successfully.'
            })
            // Redirect page
            res.redirect('/register')
            return;
        }).catch(error=>{
            // Display error 
            req.flash('errRegister',{
                message: error,
                registerInput:{fullname, phone, address, birthday, email, idCardFront, idCardBack}
            })
        })
    }
    else{
        result = result.mapped();
        let msg;
		for(fields in result){
			msg = result[fields].msg
			break
		}
        // Display error
        req.flash('errRegister',{
            message: msg,
            registerInput:{fullname, phone, address, birthday, email, idCardFront, idCardBack}
        })
        res.redirect('/register')
        return;
    }
}
exports.getLogin = async(req, res) =>{
    let error = req.flash('errLogin')[0]
    if(error){
        res.render('login',{
            messageError: error.message,
            inputLogin: error.inputLogin
        })
    }else{
        res.render('login')
    }
}
exports.postLogin = async(req, res) =>{
    let {username, password} = req.body
    let result = validationResult(req)
    let dateNow = new Date()
    if(result.errors.length === 0){
        account.findOne({username})
        .then(acc=>{
            if(!acc){
                req.flash('errLogin',{
                    message:"Username does not exist.",
                    loginInput:{username, password}
                })
                res.redirect('/')
                return;
            }else if(acc.unusualLogin === 1 && acc.countFailLogin===6){
                req.flash('errLogin',{
                    message:"The account has been locked due to entering the wrong password many times, please contact the administrator for assistance.",
                    loginInput:{username, password}
                })
                res.redirect('/')
                return;
            }else if(bcrypt.compareSync(password, acc.password)){
                return acc;
            }else{
                if(acc.role === 'user' && acc.countFailLogin < 6){
                    if(acc.countFailLogin===2){
                        account.findByIdAndUpdate(acc._id,{
                            $inc:{countFailLogin:1}, 
                            $set:{timeWait: dateNow.setSeconds(dateNow.getSeconds()+60), unusualLogin:1}
                        })
                        .then(()=>{
                            return;
                        })

                    }else if(acc.timeWait > dateNow && acc.countFailLogin >=3){ 
                        account.findByIdAndUpdate(acc._id,{$inc:{countFailLogin:1}})
                        .then(()=>{
                            return;
                        })
                        req.flash('errLogin',{
                            message:`Please try again in ${(parseInt(acc.timeWait - dateNow) / 1000)} seconds.`,
                            loginInput:{username, password}
                        });
                        return;
                    }else if(acc.timeWait < dateNow){
                        account.findByIdAndUpdate(acc._id, {$set:{countFailLogin:3},$unset:{timeWait:''}})
                        .then(()=>{
                            return;
                        })
                    }else{
                        account.findByIdAndUpdate(acc._id,{$inc:{countFailLogin:1}})
                        .then(()=>{
                            return;
                        })
                    }
                }else{
                    // account.findByIdAndUpdate(acc._id,{$set:{unusualLogin:1}})
                    // .then(()=>{
                    //     return;
                    // })
                    return;
                }
            }
        })
        .then(acc=>{
            if(!acc){
                req.flash('errLogin',{
                    message:"Password invalid.",
                    loginInput:{username, password}
                })
                res.redirect('/')
                return;
            }
            else{

                req.session.account = acc
                account.findByIdAndUpdate(acc._id,{$set:{countFailLogin:0}, $unset:{timeWait:''}})
                .then(()=>{
                    if(acc.role==='admin'){
                        return res.redirect('/admin')
                    }
                    return res.redirect('/user')
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
        .catch(error=>{
            req.flash('errLogin',{
                message: error,
                loginInput:{username, password}
            })
        })
    }else{
        result = result.mapped();
        let msg;
		for(fields in result){
			msg = result[fields].msg
			break
		}
        req.flash('errLogin',{
            message: msg,
            loginInput:{username, password}
        })
        res.redirect('/')
        return; 
    }
}
exports.getForgotPassword = async(req, res) =>{
    let error = req.flash('errForgotPassword')[0]
    let success = req.flash('successForgotPassword')[0]
    if(error){
        res.render('forgot-password',{
            messageError: error.message,
            inputForgotPassowrd: error.inputForgotPassowrd
        })
    }else if(success){
        res.render('forgot-password',{
            messageSuccess: success.message
        })
    }else{   
        res.render('forgot-password')
    }
}
exports.postForgotPassword = async(req, res) =>{
    let result = validationResult(req)
    const {email} = req.body
    if(result.errors.length === 0){
        const user = await account.findOne({email})
        if(!user){
            req.flash('errForgotPassword',{
                message: 'Email does not exist.',
                forgotPasswordInput:{email}
            })
            res.redirect('/forgot')
            return;
        }
        //check token
        let checkToken = await token.findOne({userId: user._id})
        // Create a new token when the token is not available
        if(!checkToken){
            checkToken = await new token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()

        }
        //Create link 
        const link = `${process.env.BASE_URL}/change/${user._id}/${checkToken.token}`
        console.log(link)
        //Send mail + link reset password
        await sendMail(user.email, 'Forgot password', link)
        req.flash('successForgotPassword', {
            message: 'Your request has been sent to your email, please check your email.'
        })
        res.redirect('/forgot')
        return;
    }else{
        result = result.mapped();
        let msg
		for(fields in result){
			msg = result[fields].msg
			break
		}
        req.flash('errForgotPassword',{
            message: msg,
            forgotPasswordInput: {email}
        })
        res.redirect('/forgot')
        return;
    }
}
exports.getChangePasswordLink = async(req, res) =>{
    let error = req.flash('errChangePasswordLink')[0]
    let success = req.flash('successChangePasswordLink')[0]
    if(error){
        res.render('change-password',{
            messageError: error.message,
            inputChangePassword: error.inputChangePasswordLink
        })
    }else if(success){
        res.render('change-password',{
            messageSuccess: success.message
        })
    }else{
        res.render('change-password')
    }
}
exports.postChangePasswordLink = async(req, res) =>{
    let result = validationResult(req)
    const userID = req.params.userId
    const userToken = req.params.token
    let {newpass, repass} = req.body
    if(result.errors.length === 0){
        const user = await account.findById(userID)
        if(!user){
            req.flash('errChangePasswordLink',{
                message: 'Account not registered.',
                changePasswordLinkInput:{newpass, repass}
            })
            res.redirect(`/change/${userID}/${userToken}`)
            return;
        }
        const checkToken = await token.findOne({
            userId:user._id,
            token: userToken
        })
        if(!checkToken){
            req.flash('errChangePasswordLink',{
                message: 'The link is invalid or has expired.',
                changePasswordLinkInput:{newpass, repass}
            })
            res.redirect(`/change/${userID}/${userToken}`)
            return;
        }
        if(newpass === repass){
            let hashedPassword  = await bcrypt.hash(newpass, 10)
            await account.findByIdAndUpdate(user._id, {password: hashedPassword})
            await checkToken.delete()
            req.flash('successChangePasswordLink',{
                message: 'Successfully change new password.'
            })
            res.redirect(`/change/${userID}/${userToken}`)
            return;
        }
        else{
            req.flash('errChangePasswordLink',{
                message:'Repeat password does not match.'
            })
            res.redirect(`/change/${userID}/${userToken}`)
            return;
        }
    }else{
        result = result.mapped();
        let msg
		for(fields in result){
			msg = result[fields].msg
			break
		}
        req.flash('errChangePasswordLink',{
            message: msg,
            changePasswordLinkInput:{newpass, repass}
        })
        res.redirect(`/change/${userID}/${userToken}`)
        return;
    }
}
exports.getChangePasswordFirstLogin = async(req, res) =>{
    let error = req.flash('errChangePasswordFirstLogin')[0]
    if(error){
        res.render('change-password',{
            messageError: error.message,
            inputChangePassword: error.inputChangePasswordFirstLogin
        })
    }
    res.render('change-password')

}
exports.postChangePasswordFirstLogin = async(req, res) =>{
    let result = validationResult(req)
    let {newpass, repass} = req.body
    if(result.errors.length === 0){
        if(req.session.account){
            if(newpass === repass){
                let passwordHash = await bcrypt.hash(newpass, 10)
                let user = await account.findByIdAndUpdate(req.session.account._id,{
                    password:passwordHash,
                    firstLogin: false
                })
                if(user){
                    req.session.account.firstLogin = false
                    if(req.session.account.role ==='admin'){
                        return res.redirect('/admin')
                    }
                    return res.redirect('/user')
                }else{
                    req.flash('errChangePasswordFirstLogin',{
                        message: 'Change password unsuccessful.',
                        inputChangePasswordFirstLogin:{newpass, repass}
                    })
                    res.redirect('/changePassword')
                    return;
                }
            }
        }else{
            req.flash('errChangePasswordFirstLogin',{
                message: 'Password does not match.',
                inputChangePasswordFirstLogin:{newpass, repass}
            })
            res.redirect('/changePassword')
            return;
        }
    }else{
        result = result.mapped()
        let msg
		for(fields in result){
			msg = result[fields].msg
			break
		}
        req.flash('errChangePasswordFirstLogin',{
            message: msg,
            inputChangePasswordFirstLogin:{newpass, repass}
        })
        res.redirect('/changePassword')
        return;
    }
}
exports.getLogout = async(req, res) =>{
    req.session.destroy(err => {
		console.log(err)
		res.redirect('/')
	})
}