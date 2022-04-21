const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { checkAuthentication } = require('../config/passport-local-strategy');

router.get('/', checkAuthentication, cartController.cart)

router.get('/update-cart/:id',  checkAuthentication, cartController.updateCart);

router.get('/clear-cart/:id', checkAuthentication, cartController.clearCart);

module.exports = router