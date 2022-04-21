const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { checkAuthentication } = require('../config/passport-local-strategy');

router.get('/login', userController.loginPage);

router.get('/register', userController.registerPage);

router.post('/create-user', userController.createUser);

router.post('/create-session', passport.authenticate('local', {failureRedirect:'/user/login'}), userController.createSession);

router.get('/destroy-session', userController.destroySession);

// router.get('/cart', checkAuthentication, userController.cart)

// router.get('/update-cart/:id',  checkAuthentication, userController.updateCart);

// router.get('/clear-cart/:id', checkAuthentication, userController.clearCart);

// router.get('/my-orders/', checkAuthentication, userController.myOrders);

// router.get('/place-order/:id', checkAuthentication, userController.generateOrder);

module.exports = router