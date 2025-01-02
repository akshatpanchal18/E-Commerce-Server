import asyncHandeler from "../utils/asyncHandeler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Cart } from "../models/cart.models.js";
import { Product } from '../models/product.models.js'

export const addToCart = asyncHandeler(async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user?._id

        // Validate inputs
        if (!user_id || !product_id || !quantity || quantity < 1) {
            throw new apiError(400, "Invalid input");
        }
        // console.log("Product ID:", product_id);

        // Find the product
        const findProduct = await Product.findById(product_id);
        if (!findProduct) {
            throw new apiError(404, "Product not found");
        }
        const product_price = findProduct.price;
        // console.log("Found product price:", product_price);

        // Find the user's cart
        let cart = await Cart.findOne({ userId: user_id });
        if (!cart) {
            // console.log("Creating new cart");
            cart = await Cart.create({
                userId: user_id,
                items: [{
                    productId: product_id,
                    quantity: quantity,
                    itemTotal:product_price * quantity
                }],
                totalPrice: product_price * quantity
            });
        } else {
            // console.log("Cart found");
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === product_id);
            // console.log("Existing item index:", itemIndex);

            if (itemIndex > -1) {
                // console.log("Updating quantity for existing item");
               const existingQut = cart.items[itemIndex].quantity; 
               const newQut = Number(quantity) 
            //    console.log("existing Qut",existingQut,":Qut will be added",newQut);
               cart.items[itemIndex].quantity = existingQut + newQut
               cart.items[itemIndex].itemTotal = cart.items[itemIndex].quantity * product_price
               
            } else {
                // console.log("Adding new item to cart");
                cart.items.push({
                    productId: product_id,
                    quantity: Number(quantity),
                    itemTotal: product_price * Number(quantity)
                });
            }
            // console.log("Total Price before:",cart.totalPrice);
            
            cart.totalPrice = cart.items.reduce((total, item) => total + item.itemTotal, 0);
            
            // console.log("Total Price After:",cart.totalPrice)
        }

        // Save the updated cart
        await cart.save();

        // Respond with the updated cart
        res.status(201).json(new apiResponse(201, cart, "Product added to cart"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new apiError(500, error.message, "There was a problem while adding product to cart"));
    }
});

export const getCartData = asyncHandeler(async (req,res) => {
    const user_id = req.user?._id
    console.log("getCart",user_id);
    if (!user_id) {
        throw new apiError(400,"invalid user id")
    }

    const getCart = await Cart.findOne({"userId":user_id}).populate({
        path:"items.productId",
        select:"name image price"
    })

    if (!getCart) {
        // throw new apiError(404,"cart not found")
        res.json(new apiError(404,"cart not found"))
    }
    res.status(200)
    .json(new apiResponse(200,getCart,"Cart found"))
})

export const removeItemFromCart = asyncHandeler(async (req,res) => {
    const {product_id}=req.body
    const user_id = req.user?._id
    if (!user_id || !product_id) {
        throw new apiError(400, "Invalid input");
    }

    const cart = await Cart.findOne({"userId":user_id})

    if (!cart) {
        throw new apiError(404,"cart not found")
    }
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === product_id);
     cart.items.splice(itemIndex,1)

     cart.totalPrice = cart.items.reduce((total, item) => total + item.itemTotal, 0);

     await cart.save();
     res.status(200)
     .json(new apiResponse(200,cart,"Item removed Successfully"))
})

export const updateCart = asyncHandeler(async (req,res) => {
    const {product_id, action}=req.body
    const user_id = req.user?._id
    if (!user_id || !product_id || !action) {
        throw new apiError(400, "Invalid input");
    }
    console.log(action);
    const product = await Product.findById(product_id);
        if (!product) {
            throw new apiError(404, "Product not found");
        }
    const cart = await Cart.findOne({"userId":user_id})

    if (!cart) {
        throw new apiError(404,"cart not found")
    }
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === product_id);
    if(itemIndex > -1){
        const currentQut = cart.items[itemIndex].quantity
         
        if (action === "increment") {
            cart.items[itemIndex].quantity += 1
        } else if(action === "decrement"){
            if (currentQut === 1) {
                throw new apiError(405,"Item Qut must be Greater than 0")
            }
            cart.items[itemIndex].quantity -= 1;
        }
    
    cart.items[itemIndex].itemTotal = product.price * cart.items[itemIndex].quantity

    cart.totalPrice = cart.items.reduce((total, item) => total + item.itemTotal, 0);
    await cart.save()
    // res.status(200).json(new apiResponse(200, cart, "Cart quantity updated successfully"));
}else {
    throw new apiError(404, "Product not found in cart");
}
    res.status(200)
    .json(new apiResponse(200, cart, "Cart quantity updated successfully"));
})

export const clearAllItem = asyncHandeler(async (req,res) => {
    const user_id = req.user?._id
    if (!user_id) {
        throw new apiError(400, "Invalid input");
    }
    const cart = await Cart.findOne({"userId":user_id})
    if (!cart) {
        throw new apiError(404,"Cart not found")
    }
    cart.items=[]
    cart.totalPrice=0

    await cart.save()
    res.status(200)
    .json(new apiResponse(200,cart,"Items removed Successfully"))
})