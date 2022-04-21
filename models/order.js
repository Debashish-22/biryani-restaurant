const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items:{
        type: Object,
        required: true
    },
    orderTotal:{
        type: Number,
        required: true
    },
    orderAt:{
       type: String,
       required:true
    },
    orderStatus:{  
       type: Object,
       required: true
    }
},{
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema);

module.exports= Order