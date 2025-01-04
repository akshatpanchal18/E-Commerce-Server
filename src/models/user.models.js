import mongoose,{Schema} from "mongoose";
import jwt from 'jsonwebtoken'

const userSchema = new Schema({

    userInfo:{
        username:{
            type:String,
            required:true,
            unique: true,
        },
        first_name:{
            type:String,
            required:true,
        },
        last_name:{
            type:String,
            required:true,
        },
        contact_no:{
            type:Number,
            required:true,
            unique: true,
        },
        email:{
            type:String,
            required:true,
            unique: true,
        },
        password:{
            type:String,
            required:true,
        },
    },
    user_address:{
        address:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        zip_code:{
            type:Number,
            required:true,
        }
    },
    token:{
        type:String,
    }

},{timestamps:true})

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.userInfo.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    }
export const User = mongoose.model("User", userSchema);