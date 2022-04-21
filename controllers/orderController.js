const Cart = require('../models/cart');
const Order = require('../models/order');
const User = require('../models/user');
const moment = require('moment');

const myOrders = async(req, res) =>{
    try{
        if(req.user){
            let cart = await Cart.findById(req.user.cartId);

            let currentOrders = await Order.find({customer : req.user.id, "orderStatus.delivered": false});
            let previousOrders = await Order.find({customer : req.user.id, "orderStatus.delivered": true});
            
            if(cart){

                return res.render('my_orders_page', {
                    title: "My Orders | Biryani",
                    totalItems : cart.totalItems,
                    currentOrders: currentOrders,
                    previousOrders: previousOrders,
                })
            }
            defaultCart = 0;
            return res.render('my_orders_page', {
                title: 'My Orders | Biryani',
                totalItems: defaultCart,
                currentOrders: currentOrders,
                previousOrders: previousOrders,
            })
        }
    }
    catch(err){
        req.flash('error', "Error!");
        return res.redirect('back');
    }
}

const generateOrder = async(req, res) =>{
    try{

        let user = await User.findById(req.user.id)
        let cartItems = await Cart.findById(req.params.id);
        let orderTime = moment().format('MMMM D, h:mm:ss a');

        if( user && cartItems){

            let newOrder = await Order.create({
                customer: req.user.id,
                items: cartItems.items,
                orderTotal: cartItems.totalPrice,
                orderAt: orderTime,
                orderStatus: { order_placed: true,
                    order_confirmed: false,
                    preparing: false,
                    out_for_delivery: false,
                    delivered: false
                }
            })

            user.orders.push(newOrder.id);
            user.save();
            await Cart.findByIdAndDelete(req.params.id);
            let currentUser = await User.findById(req.user.id);
            currentUser.cartId = null;
            currentUser.save();

            req.flash('success', 'Order placed! check MyOrders')
            return res.redirect('back');
        }
        return res.redirect('back');        
    }
    catch(err){
        req.flash('error', "Error!");
        return res.redirect('back');
    }
}

module.exports = {
    myOrders,
    generateOrder
}