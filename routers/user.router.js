const router = require('express').Router()

const userController = require('../controller/user.controller')
const checkLogin = require('../middlewares/checkLogin')
const checkFirstLogin = require('../middlewares/checkFirstLogin')
router.get('/', checkLogin, checkFirstLogin, userController.home)

router.get('/topUp', checkLogin, checkFirstLogin, userController.getTopUp)
router.post('/topUp', checkLogin, checkFirstLogin, userController.postTopUp)

router.get('/withdraw', checkLogin, checkFirstLogin, userController.getWithdraw)
router.post('/withdraw', checkLogin, checkFirstLogin, userController.postWithdraw)

router.get('/buyCard', checkLogin, checkFirstLogin, userController.getBuyCard)
router.post('/buyCard', checkLogin, checkFirstLogin, userController.postBuyCard)

router.get('/transfer', checkLogin, checkFirstLogin, userController.getTransfer)
router.post('/checkPhone', checkLogin, checkFirstLogin, userController.postCheckPhone)
router.post('/sendOTP', checkLogin, checkFirstLogin, userController.postSendOTP)
router.post('/transfer', checkLogin, checkFirstLogin, userController.postTransfer)

router.get('/history', checkLogin, checkFirstLogin, userController.getHistory)
router.get('/history/:id', checkLogin, checkFirstLogin, userController.getDetailHistory)

router.get('/listChat', checkLogin, checkFirstLogin, userController.listChat)
router.get('/chat', checkLogin, checkFirstLogin, userController.chat)

module.exports = router;

