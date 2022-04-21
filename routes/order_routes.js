const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { checkAuthentication } = require('../config/passport-local-strategy');

router.get('/my-orders/', checkAuthentication, orderController.myOrders);

router.get('/place-order/:id', checkAuthentication, orderController.generateOrder);

module.exports = router