import { Router } from "express";
import { adminLogin, createUser, getCurrentUser, reGenrateToken, userLogin, userLogout} from "../controller/user.controller.js";
import { verifyAdmin, verifyJwt} from '../middelware/auth.middelware.js' 

const router = Router()

router.post('/register-user',createUser)
router.post('/login',userLogin)
router.post('/login-admin',adminLogin)

//secured routes
router.post('/logout',verifyJwt,userLogout)
router.post('/logout-admin',verifyAdmin,adminLogin)
router.get('/get-current-user',verifyJwt,getCurrentUser)
router.post('/refresh-token',reGenrateToken)

export default router