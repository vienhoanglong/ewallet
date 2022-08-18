const {check} = require('express-validator')
module.exports = [
    check('fullname')
    .exists().withMessage('Please enter your full name.')
    .notEmpty().withMessage('Full name can not be empty.')
    .isLength({ min: 5 }).withMessage('Full name must have at least 6 characters.'),
    check('phone')
    .exists().withMessage('Please enter your phone number.')
    .notEmpty().withMessage('Phone number can not be empty.')
    .isNumeric().withMessage('Phone number invalid.'),
    check('address')
    .exists().withMessage('Please enter your address.')
    .notEmpty().withMessage('Address can not be empty.')
    .isLength({ min: 6 }).withMessage('Address must have at least 6 characters.'),
    check('birthday')
    .exists().withMessage('Please enter your birthday.')
    .notEmpty().withMessage('Birthday can not be empty.'),
    check('email')
    .exists().withMessage('Please enter your email')
    .notEmpty().withMessage('Email can not be empty')
    .isEmail().withMessage('Email invalid'),
]