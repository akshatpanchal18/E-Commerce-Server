import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
    cors: {
        origin: 'https://e-commerce-admin-1n3a.onrender.com',
        methods: ['GET', 'POST'],
        allowedHeaders: ["my-custom-header"],
    credentials: true
    },
});

app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = process.env.CORS_ORIGIN.split(',');
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); // Allow the origin
        } else {
          callback(new Error('Not allowed by CORS')); // Reject the origin
        }
      },
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );
  

app.use(express.json({limit:"5mb"}))

// url data fetchin /url encoder
app.use(express.urlencoded({extended:true,limit:"5mb"}))

app.use(cookieParser())

//Routes
import userRoutes from './routes/user.routes.js'
import productRoutes from './routes/product.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import checkoutRoutes from './routes/checkout.routes.js'

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/cart",cartRoutes)
app.use("/api/v1/order",orderRoutes)
app.use("/api/v1/checkout",checkoutRoutes)


// WebSocket events
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle any events you want here
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// export default app
export  {server,io}