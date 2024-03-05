const express = require('express');
const router = express.Router();

const passport = require('passport');
const { storeReturnTo } = require('../middleware');

const userController = require('../controllers/users')

router.route('/register')
    .get(userController.registerForm)
    .post(userController.registerCreate)

router.route('/login')
    .get(userController.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser)

router.get('/logout', userController.logout);

//router.get('/register', userController.registerForm)
//router.post('/register', userController.registerCreate)
//router.get('/login', userController.loginForm)
//router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginUser)



module.exports = router;