const {check} = require('express-validator')
module.exports = [ 
    check('email').exists().withMessage('Please enter your email.')
    .notEmpty().withMessage('Email can not be empty.')
    .isEmail().withMessage('Email invalid.')
]