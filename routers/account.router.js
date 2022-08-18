const router = require('express').Router()
const accountController = require('../controller/account.controller')
const loginValidator = require('../validators/login.validator')
const registerValidator = require('../validators/register.validator')
const forgotPasswordValidator = require('../validators/forgot.validator')
const changePasswordValidator = require('../validators/change.validator')
// Register account
router.get('/register',accountController.getRegister )
router.post('/register',accountController.multipleUpload, registerValidator, accountController.postRegister)
// Login
router.get('/', accountController.getLogin)
router.post('/',loginValidator, accountController.postLogin)
// Forgot password
router.get('/forgot', accountController.getForgotPassword)
router.post('/forgot', forgotPasswordValidator, accountController.postForgotPassword)
// Change password with link
router.get('/change/:userId/:token', accountController.getChangePasswordLink)
router.post('/change/:userId/:token', changePasswordValidator, accountController.postChangePasswordLink)
// Change password first login
router.get('/changePassword', accountController.getChangePasswordFirstLogin)
router.post('/changePassword', changePasswordValidator, accountController.postChangePasswordFirstLogin)
// Logout
router.get('/logout', accountController.getLogout)
module.exports = router;

