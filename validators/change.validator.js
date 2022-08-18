const {check} = require('express-validator')
module.exports = [
    check('newpass').exists().withMessage('Please enter your new password.')
    .notEmpty().withMessage('New password can not be empty.')
    .isLength({min : 6}).withMessage('New password must have at least 6 characters'),
    
    check('repass').exists().withMessage('Please enter your repassword.')
    .notEmpty().withMessage('Repassword can not be empty.')
    .custom((value, {req}) => {
            if(value !== req.body.newpass){
            throw new Error('Password does not match')
            }
            return true
    })
]