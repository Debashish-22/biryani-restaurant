const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        min:10,
        max: 10,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    cartId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },
    orders: {
        type: Array,
    }
},{
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User