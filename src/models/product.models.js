import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    brand: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    image: { 
        type: String ,
        required:true
    },
    // images: [{ 
    //     type: String ,
    //     required:true
    // }],
    isFeatured: { 
        type: Boolean, 
        default: false 
    },
    rating: { type: Number, default: 0 }, 
    reviews: [{
        user: {
            name:{
                type:String,
                required:true,
            } ,
            email:{
                type:String,
                required:true,
            }
           },
        rating: { type: Number, required: true }, 
        comment: { type: String, required: true }, 
        createdAt: { type: Date, default: Date.now }
      }],
    numReviews: { 
    type: Number, 
    default: 0 
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product",productSchema)