import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index: true,
        lowercase: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    fullName:{
        type: String,
        required: true,
    },

    password:{
        type: String, 
        required: true,
    },

    allRefreshTokens:[
        {
            token:{
                type: String,
                required: true
            },
            createdAt:{
                type: Date,
                default: Date.now
            },
            expiresAt:{
                type: Date,
                required: true
            }
        }
    ]

}, {timestamps: true});

export const User = mongoose.model("User", userSchema);