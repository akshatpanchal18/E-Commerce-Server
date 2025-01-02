import Router from 'express'
import {verifyAdmin, verifyJwt} from '../middelware/auth.middelware.js'
import { createOrder, getAllOrderdata, getOrder, updateOrderStatus } from '../controller/order.controller.js'

const router = Router()

router.post('/create-order',verifyJwt,createOrder)
router.get('/get-orders',verifyJwt,getAllOrderdata)

//secired routes
router.get('/admin-order',verifyAdmin,getOrder)
router.patch('/update-status',verifyAdmin,updateOrderStatus)

export default router