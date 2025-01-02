import asyncHandeler from "../utils/asyncHandeler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { io } from '../app.js';
import { CheckOut } from "../models/checkout.models.js";

export const createOrder = asyncHandeler(async (req, res) => {
  const user_id = req.user?._id;
  const { checkout_id,paymentType } = req.body;

  if (!checkout_id ||!paymentType) {
    throw new apiError(400, "All fields required");
  }

  const user = await User.findById(user_id);
  if (!user) {
    throw new apiError(404, "user not found");
  }

  try {

    const findCheckout = await CheckOut.findById(checkout_id)
    if (!findCheckout) {
      throw new apiError(404, "Checkout not found");
    }
   
    const newOrder = await Order.create({
      userId: user._id,
      items: findCheckout.items,
      totalAmount: findCheckout.orderTotal,
      paymentType,
      shippingAddress: user.user_address,
    });

    await newOrder.populate({
        path: 'items.productId',
        select: 'name image', // Adjust the field names as necessary
      });

    io.emit('newOrder', newOrder);
    // console.log(newOrder);
      res.status(201)
      .json(new apiResponse(201, newOrder, "order created successfully"));
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw new apiError(500, "something went wrong in create order");
  }
});

export const updateOrderStatus = asyncHandeler(async (req, res) => {
  console.log(req.body);
  
  const { order_id, status } = req.body;
  if ( !status || !order_id) {
    throw new apiError(400, "invalid input");
  }
  const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new apiError(
      400,
      `Invalid status. Allowed values are: ${validStatuses.join(", ")}.`
    );
  }
  const findorder = await Order.findById(order_id);
  if (!findorder) {
    throw new apiError(404, "order ot found");
  }
findorder.orderStatus = status
  await findorder.save();

  res.status(200).json(new apiResponse(200, findorder, "order status updated"));
});

export const getAllOrderdata = asyncHandeler(async (req, res) => {
  const user_id = req.user?._id;
  if (!user_id) {
    throw new apiError(400, "please login");
  }
  const findDetails = await Order.find({ userId: user_id }).populate({
    path: 'items.productId',
select: 'name image', 
});
  // console.log(findDetails);
  if (!findDetails) {
    throw new apiError(404, "order not found");
  }
  const responseData = findDetails.map(order => ({
    _id:order._id,
    items: order.items,
    totalAmount: order.totalAmount,
    orderStatus: order.orderStatus,
    date:order.createdAt
  }));
  
  res.status(200)
    .json(new apiResponse(200, responseData, "Order found"));
});

export const getOrder = asyncHandeler(async (req,res) => {
    try {
        const orders = await Order.find({}).populate({
            path: 'items.productId',
        select: 'name image', 
        });

        if (!orders || orders.length === 0) {
          return res.status(404).json(new apiResponse(404, [], "No orders found"));
        }
    
        res.status(200).json(new apiResponse(200, orders, "Orders retrieved successfully"));
      } catch (error) {
        res.status(500).json(new apiResponse(500, null, "Internal Server Error"));
      }
})