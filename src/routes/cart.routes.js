import Router from 'express'
import {verifyJwt} from '../middelware/auth.middelware.js'
import { addToCart, clearAllItem, getCartData, removeItemFromCart, updateCart } from '../controller/cart.controller.js'


const router = Router()

router.post('/add-cart',verifyJwt,addToCart)
router.get('/get-cart',verifyJwt,getCartData)
router.delete('/remove-item',verifyJwt,removeItemFromCart)
router.patch('/update-quantity',verifyJwt,updateCart)
router.patch('/clear-all',verifyJwt,clearAllItem)

export default router