const User = require('../models/user');
const bcrypt = require('bcrypt');

const loginPage = (req, res) =>{
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    res.render('login_page', {
        title: 'Login | Biryani'
    })
}

const registerPage = (req, res) =>{
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    res.render('register_page', {
        title: 'Register | Biryani'
    })
}

const createUser = async(req, res) =>{
    try{
        let user;
        user = await User.findOne({phone: req.body.phone});
    
        if(user){  
            req.flash('error', 'Phone number exists, Please Log in')
            return res.redirect('back')
        }

        if(req.body.password !== req.body.confirmPassword){
            req.flash('error', "Password and confirm password didn't matched")
            return res.redirect('back')
        }

        let hashedPassword = await bcrypt.hash(req.body.password, 10);

        user = await User.create({
            name: req.body.name,
            phone: req.body.phone,
            password: hashedPassword,
            address: req.body.address
        })

        req.flash('success', "Successfully Registered!,Please Log in")
        return res.redirect('/user/login')
    }
    catch(err){
        console.log("Error in creating user.")
        return res.redirect('back')
    }
}

const createSession = async(req, res) =>{
    try{

        let user = await User.findById(req.user.id);  

        if(!user){
            return res.redirect('/users/sign-in');
        }

        req.flash('success', 'Logged in successfully!'); 
        return res.redirect('/');
    }
    catch(err){
        console.log("Error in Login.")
        return res.redirect('back')
    }
}

const destroySession = (req, res) =>{
   
    req.logout();
    req.flash('success', 'Logged out!')
    return res.redirect('/');
}


// let item;

// const updateCart = async(req, res) =>{
//     try{

//         let food = await Food.findById(req.params.id);
//         let user = await User.findById(req.user.id)

//         if(!food){
//             return res.redirect('back')
//         }

//         if(!user.cartId){

//             item = {
//                 id: food.id,
//                 name: food.name,
//                 quantity: 1,
//                 price: food.price,
//             }

//             let newCart = await Cart.create({
//                 items: item,
//                 totalItems: 1,
//                 totalPrice: food.price
//             })

//             user.cartId = newCart.id;
//             user.save();

//             if(req.xhr){
//                 return res.json({
//                     cart: newCart
//                 })
//             }
            
//         }
//         else{
           
//             let duplicate = await Cart.findOne({'items.id': food.id})

//             if(!duplicate){

//                 let totalItems = 0;
//                 let totalPrice = 0;

//                 item = {
//                     id: food.id,
//                     name: food.name,
//                     quantity: 1,
//                     price: food.price,
//                 }

//                 let cart = await Cart.findById(user.cartId)
//                 cart.items.push(item);

//                 cart.items.map((data)=>{
                   
//                     totalPrice += data.price
//                     totalItems += data.quantity
//                 })

//                 cart.totalItems = totalItems;
//                 cart.totalPrice = totalPrice;
//                 cart.save();
             
//                 if(req.xhr){
//                     return res.json({
//                         cart
//                     })
//                 }
//             }
//             else{
//                 let totalItems = 0;
//                 let totalPrice = 0;
               
//                 await Cart.updateOne(
//                     {id: food.id, 'items.id': food.id},
//                     { $inc:{"items.$.quantity": 1,"items.$.price": food.price}}
//                 )

//                 let cart = await Cart.findById(user.cartId)

//                 cart.items.map((data)=>{
                   
//                     totalPrice += data.price
//                     totalItems += data.quantity
//                 })
//                 cart.totalItems = totalItems;
//                 cart.totalPrice = totalPrice;
//                 cart.save();

//                 if(req.xhr){
//                     return res.json({
//                         cart
//                     })
//                 } 
//             }     
//         }
//     }
//     catch(err){
//         console.log(err)
//         return;
//     }
// }

// const cart = async(req, res) =>{

//     try{
//         if(req.user){
//             let cart = await Cart.findById(req.user.cartId);

//             if(cart){
                
//                 return res.render('cart_page', {
//                     title: "MyCart | Biryani",
//                     cartId: cart.id,
//                     totalItems : cart.totalItems,
//                     totalPrice: cart.totalPrice,
//                     cartItems: JSON.stringify(cart.items)
//                 })
//             }
//             defaultCart = 0
//             return res.render('cart_page', {
//                 title: 'MyCart | Biryani',
//                 totalItems: defaultCart
//             })
//         } 
//     }
//     catch(err){
//         console.log(err)
//         return res.redirect('back');
//     }
// }

// const clearCart = async(req, res) =>{
//     try{
    
//         await Cart.findByIdAndDelete(req.params.id);
//         let user = await User.findOneAndUpdate({id: req.user.id}, {$unset: {cartId: req.params.id }});
//         user.save();
//         req.flash('success', 'Cart Cleared!')
//         return res.redirect('back');
//     }
//     catch(err){
//         console.log(err)
//         return res.redirect('back');
//     }
// }

// const generateOrder = async(req, res) =>{
//     try{

//         let user = await User.findById(req.user.id)
//         let cartItems = await Cart.findById(req.params.id);
//         let orderTime = moment().format('MMMM D, h:mm:ss a');

//         if( user && cartItems){

//             let newOrder = await Order.create({
//                 customer: req.user.id,
//                 items: cartItems.items,
//                 orderTotal: cartItems.totalPrice,
//                 orderAt: orderTime,
//                 orderStatus: { order_placed: true,
//                     order_confirmed: false,
//                     preparing: false,
//                     out_for_delivery: false,
//                     delivered: false
//                 }
//             })

//             user.orders.push(newOrder.id);
//             user.save();
//             await Cart.findByIdAndDelete(req.params.id);
//             let currentUser = await User.findOneAndUpdate({id: req.user.id}, {$unset: {cartId: req.params.id }});
//             currentUser.save();

//             req.flash('success', 'Order placed! check MyOrders')
//             return res.redirect('back');
//         }
//         return res.redirect('back');        
//     }
//     catch(err){
//         console.log(err);
//         return res.redirect('back');
//     }
// }

// const myOrders = async(req, res) =>{
//     try{
//         if(req.user){
//             let cart = await Cart.findById(req.user.cartId);

//             let currentOrders = await Order.find({customer : req.user.id, "orderStatus.delivered": false});
//             let previousOrders = await Order.find({customer : req.user.id, "orderStatus.delivered": true});
            
//             if(cart){

//                 return res.render('my_orders_page', {
//                     title: "My Orders | Biryani",
//                     totalItems : cart.totalItems,
//                     currentOrders: currentOrders,
//                     previousOrders: previousOrders,
//                 })
//             }
//             defaultCart = 0
//             return res.render('my_orders_page', {
//                 title: 'My Orders | Biryani',
//                 totalItems: defaultCart,
//                 currentOrders: currentOrders,
//                 previousOrders: previousOrders,
//             })
//         }
//     }
//     catch(err){
//         console.log(err)
//         return res.redirect('back');
//     }
// }

module.exports = {
    loginPage, 
    registerPage, 
    createUser, 
    createSession, 
    destroySession,
}