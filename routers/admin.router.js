const router = require('express').Router()

const adminController = require('../controller/admin.controller')
const checkIsAdmin = require('../middlewares/checkIsAdmin')

router.get('/', checkIsAdmin, adminController.admin)
router.post('/posts', checkIsAdmin, adminController.postNotice)

module.exports = router;