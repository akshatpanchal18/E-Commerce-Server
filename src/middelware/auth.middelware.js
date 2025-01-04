import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import asyncHandeler from "../utils/asyncHandeler.js";
import jwt from 'jsonwebtoken'

export const verifyJwt = asyncHandeler(async (req,res,next) => {
    const cookieToken = req.cookies.userToken

    if (!cookieToken) {
        throw new apiError(400,"Unathorized request")
    }
    try {
        const decodeToken = jwt.verify(cookieToken,process.env.ACCESS_TOKEN_SECRET) 
        const user = await User.findById(decodeToken?._id)
        if (!user) {
            throw new apiError(404,'Invalid Token')
        }
        req.user = user
        next()
    } catch (error) {
        throw new apiError(401,error?.message||"Invalid access token")
    }
})

export const verifyAdmin = asyncHandeler(async (req,res,next) => {
    const adminID = "676157e96fd7f4736f576087";
    const cookieToken = req.cookies.AdminToken
    if (!cookieToken) {
        throw new apiError(400,"Unathorized request")
    }
    try {
        const decodeToken = jwt.verify(cookieToken,process.env.ACCESS_TOKEN_SECRET)
        if (decodeToken?._id !== adminID) {
            throw new apiError(405,'Access Denaied')
        }
        next()
    } catch (error) {
        throw new apiError(401,error?.message||"Invalid access token")
    }
    
})