const {check} = require('express-validator')
module.exports = [
    check('card_num')
    .exists().withMessage('Please enter your card number.')
    .notEmpty().withMessage('Card number can not be empty.')
    .isNumeric().withMessage('Card number invalid'),
    check('expiry_date')
    .exists().withMessage('Please enter your expiry date.')
    .notEmpty().withMessage('Expiry date can not be empty.'),
    check('cvv')
    .exists().withMessage('Please enter your cvv.')
    .notEmpty().withMessage('CVV can not be empty.')
    .isLength({max:3, min: 3}).withMessage('CVV must have 3 numbers.')
    .isNumeric().withMessage('Cvv invalid.'),
    check('money')
    .exists().withMessage('Please enter your money top up.')
    .notEmpty().withMessage('Money top up can not be empty.').isNumeric().withMessage('Money top up invalid'),
]