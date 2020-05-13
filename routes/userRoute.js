const router = require('express').Router()
const userController = require('../controller/userController.js')
const middleware = require('../middleware/tokenValidation')

router.post('/login', userController.login);
router.post('/', userController.addUser);
router.get('/', middleware.isTokenPresent, userController.getAllUsers);
router.put('/', middleware.isTokenPresent, userController.updateScore);




module.exports = router