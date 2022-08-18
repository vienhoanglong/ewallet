const {check} = require('express-validator')
module.exports = [
    check('username').exists().withMessage('Please enter your username.')
    .notEmpty().withMessage('Username can not be empty.')
    .custom(value => !/\s/.test(value)).withMessage('Username must not have spaces.'),
    check('password').exists().withMessage('Please enter your password.')
	.notEmpty().withMessage('Password can not be empty.')
    .isLength({ min: 6 }).withMessage('Password must have at least 6 characters.'),
]