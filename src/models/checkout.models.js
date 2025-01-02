import mongoose, { Schema } from "mongoose";

const checkoutSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
            type: Number,
            required: true, // Ensure the price is stored here as well
        },
        itemTotal: {
            type: Number,
            required: true, // Ensure item total is also captured
          },
      },
    ],
    orderTotal: {
      type: Number,
      required: true, // Ensure the total is always provided
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

export const CheckOut = mongoose.model("CheckOut", checkoutSchema);
