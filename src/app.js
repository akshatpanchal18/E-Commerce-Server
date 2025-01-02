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
        origin: ['http://localhost:5173',"http://localhost:5174"],
        methods: ['GET', 'POST'],
        allowedHeaders: ["my-custom-header"],
    credentials: true
    },
});

app.use(cors({
    // origin:process.env.CORS_ORIGIN,
    origin:["http://localhost:5173","http://localhost:5174"],
    credentials: true,
}))

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