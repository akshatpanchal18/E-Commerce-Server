import asyncHandeler from "../utils/asyncHandeler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Cart } from "../models/cart.models.js";
import { CheckOut } from "../models/checkout.models.js";

export const createCartCheckOut = asyncHandeler(async (req, res) => {
    const user_id = req.user?._id; 
    const { items, total } = req.body;

    if (!user_id) {
        throw new apiError(400, "Please login.");
    }

    if (!items || !total) {
        throw new apiError(404, "Invalid data or empty data.");
    }
    // console.log("Received Items:", items);
    
    let formattedItems;

    if (items[0] && items[0]._id) {
        // This means we have the first structure with the outer object
        const checkoutData = items[0]; // Get the first object
        const checkoutItems = checkoutData.items; // Access the items array

        // Map through the items array to format it
        formattedItems = checkoutItems.map(item => ({
            productId: item.productId._id, // Use the productId's _id if it exists
            quantity: item.quantity,
            price: item.productId.price, // Extract price from productId if available
            itemTotal: item.itemTotal || item.totalPrice // Fallback to totalPrice
        }));
    } else if (items[0] && items[0].productId) {
        // This means we have the second structure directly
        formattedItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            itemTotal: item.totalPrice // Directly use the totalPrice
        }));
    } else {
        throw new apiError(400, "Invalid items structure.");
    }

    // console.log("Formatted Items:", formattedItems);
    const checkOutData = await CheckOut.create({
        user: user_id,
        items: formattedItems, 
        orderTotal: total, 
    });
    await checkOutData.populate({
        path: 'items.productId',
        select: 'name image'
    })
    // const findcart = await Cart.findOneAndUpdate({userId:user_id},{items:[],totalPrice:0},{new:true})

    res.status(201)
    .json(new apiResponse(201,checkOutData,"CheckOut successfully"))
});
