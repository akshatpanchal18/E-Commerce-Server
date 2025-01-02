import mongoose, { Schema } from "mongoose";

const itemsSchema = new Schema({
    items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, required: true },
          price: { type: Number, required: true },
          _id: false, 
        },
      ],
      totalAmount: { type: Number, required: true },
      paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Pending",
      },
      orderStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
      },
      
      
},{timestamps:true})

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        _id: false, 
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentType:{
      type:String,
      required:true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        zip_code: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
