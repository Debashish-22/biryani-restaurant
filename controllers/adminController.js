const Food = require('../models/food');
const Order = require('../models/order');

const adminHome = async(req, res) =>{

    try{

        let currentOrders = await Order.find({"orderStatus.delivered": false}).populate('customer');
        let previousOrders = await Order.find({"orderStatus.delivered": true});

        return  res.render('admin_home',{
            title: "Admin | Biryani",
            currentOrders: currentOrders,
            previousOrders: previousOrders
        })
    }
    catch(err){
        req.flash('error', "Error");
        res.redirect('back');
    }   
}

const uploadDishPage = (req, res) =>{
    res.render('upload_dish',{
        title: "New Dish | Biryani"
    })
}

const createDish = async(req, res) =>{

    try{
      
        await Food.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            imagePath : req.file.filename,
        })

        req.flash('success', "Dish Created Successfully!");
        return res.redirect('back');
    }
    catch(err){
       
        req.flash('error', "Error in creating Dish!")
        return  res.redirect('back');
    }
}

const updateOrder = async(req, res) =>{
    try{

        let order = await Order.findById(req.body.orderId);
        order.orderStatus = {
            order_placed: true,
            order_confirmed: req.body.order_confirmed ? true : false,
            preparing: req.body.preparing ? true : false,
            out_for_delivery: req.body.out_for_delivery ? true : false,
            delivered: req.body.delivered ? true : false
        }
        order.save();
        return res.redirect('back');
    }
    catch(err){
        req.flash('error', "Error");
        return res.redirect('back');
    }
}

module.exports = { 
    adminHome, 
    uploadDishPage, 
    createDish,
    updateOrder
}