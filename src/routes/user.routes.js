import { Router } from "express";
import { createUser, getCurrentUser, reGenrateToken, userLogin, userLogout} from "../controller/user.controller.js";
import { verifyJwt} from '../middelware/auth.middelware.js' 

const router = Router()

router.post('/register-user',createUser)
router.post('/login',userLogin)

//secured routes
router.post('/logout',verifyJwt,userLogout)
router.get('/get-current-user',verifyJwt,getCurrentUser)
router.post('/refresh-token',reGenrateToken)

export default router