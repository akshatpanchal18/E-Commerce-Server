import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    itemTotal :{
        type: Number,
        default:0,
    }
}, { _id: false }); 

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    // totalItems:{
    //     type: Number,
    //     default: 0
    // },
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true }); 

export const Cart = mongoose.model('Cart', cartSchema);

