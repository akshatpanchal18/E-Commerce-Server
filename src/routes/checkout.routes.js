import Router from 'express'
import {verifyAdmin, verifyJwt} from '../middelware/auth.middelware.js'
import { createCartCheckOut } from '../controller/checkout.controller.js'

const router = Router()
router.post('/check-out',verifyJwt,createCartCheckOut)

export default router