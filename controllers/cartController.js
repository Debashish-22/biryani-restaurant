const Food = require('../models/food');
const User = require('../models/user');
const Cart = require('../models/cart');

let item;

const cart = async(req, res) =>{

    try{
        if(req.user){

            let cart = await Cart.findById(req.user.cartId);
            if(cart){
                
                return res.render('cart_page', {
                    title: "MyCart | Biryani",
                    cartId: cart.id,
                    totalItems : cart.totalItems,
                    totalPrice: cart.totalPrice,
                    cartItems: JSON.stringify(cart.items)
                })
            }
            defaultCart = 0
            return res.render('cart_page', {
                title: 'MyCart | Biryani',
                totalItems: defaultCart
            })
        } 
    }
    catch(err){
        req.flash('error', "Error!");
        return res.redirect('back');
    }
}

const updateCart = async(req, res) =>{
    try{

        let food = await Food.findById(req.params.id);
        let user = await User.findById(req.user.id);

        if(!food){
            return res.redirect('back');
        }

        if(!user.cartId){

            item = {
                id: food.id,
                name: food.name,
                quantity: 1,
                price: food.price,
            }

            let newCart = await Cart.create({
                items: item,
                totalItems: 1,
                totalPrice: food.price
            })

            user.cartId = newCart.id;
            user.save();

            if(req.xhr){
                return res.json({
                    cart: newCart
                })
            } 
        }
        else{
           
            let duplicate = await Cart.findOne({'items.id': food.id});

            if(!duplicate){

                let totalItems = 0;
                let totalPrice = 0;

                item = {
                    id: food.id,
                    name: food.name,
                    quantity: 1,
                    price: food.price,
                }

                let cart = await Cart.findById(user.cartId)
                cart.items.push(item);

                cart.items.map((data)=>{
                   
                    totalPrice += data.price
                    totalItems += data.quantity
                })

                cart.totalItems = totalItems;
                cart.totalPrice = totalPrice;
                cart.save();
             
                if(req.xhr){
                    return res.json({
                        cart
                    })
                }
            }
            else{
                let totalItems = 0;
                let totalPrice = 0;
               
                await Cart.updateOne(
                    {id: food.id, 'items.id': food.id},
                    { $inc:{"items.$.quantity": 1,"items.$.price": food.price}}
                )

                let cart = await Cart.findById(user.cartId)

                cart.items.map((data)=>{
                   
                    totalPrice += data.price
                    totalItems += data.quantity
                })
                cart.totalItems = totalItems;
                cart.totalPrice = totalPrice;
                cart.save();

                if(req.xhr){
                    return res.json({
                        cart
                    })
                } 
            }     
        }
    }
    catch(err){
        req.flash('error', "Error!");
        return;
    }
}

const clearCart = async(req, res) =>{
    try{
    
        await Cart.findByIdAndDelete(req.params.id);
        let user = await User.findById(req.user.id);
        user.cartId = null;
        user.save();
        req.flash('success', 'Cart Cleared!');
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', "Error!");
        return res.redirect('back');
    }
}

module.exports = {
    cart,
    updateCart,
    clearCart
}