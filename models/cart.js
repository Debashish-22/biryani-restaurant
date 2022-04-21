const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: {
        type: Array,
        required: true
    },
    totalItems:{
        type: Number,
    },
    totalPrice:{
        type: Number
    }
   
},{
    timestamps: true
})

const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart