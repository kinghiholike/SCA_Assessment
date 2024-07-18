const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/userAuth');

router.get('/', (req, res) => res.send('respond with a resource'));
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/getUser', authenticateUser, userController.getUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
