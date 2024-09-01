import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity:{
        type: Number,
        required: true
    }
})

const orderSchema = new mongoose.Schema({  
    price: {
        type: Number,
        required: true        
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderItems:[orderItemSchema]
 }, {timestamps: true})

 export const Order = mongoose.model('Order', orderSchema);