const Food = require('../models/food');
const Cart = require('../models/cart');

const home = async(req, res) =>{

    try{
        let foods = await Food.find();

        if(req.user){
            let cart = await Cart.findById( req.user.cartId)
            if(cart){
                
                return res.render('home', {
                    title: "Home | Biryani",
                    foods: foods,
                    totalItems : cart.totalItems
                })
            }
            defaultCart = 0
            return res.render('home', {
                title: 'Home | Biryani',
                foods: foods,
                totalItems: defaultCart
            })
        }
       
        res.render('home', {
            title: 'Home | Biryani',
            foods: foods
        })
    }
    catch(err){
        console.log(err);
        return res.redirect('/')
    }
   
}

module.exports = { home }