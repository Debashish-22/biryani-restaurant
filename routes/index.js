const express = require('express');
const router = express.Router();

const homeRoutes = require('./home_routes');
const adminRoutes = require('./admin_routes');
const userRoutes = require('./user_route');
const cartRoutes = require('./cart_routes');
const orderRoutes = require('./order_routes');

router.use('/', homeRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);

router.get('*', (req, res)=>{
    res.render('error_page', {
        title:"Lost?"
    })
})

module.exports = router