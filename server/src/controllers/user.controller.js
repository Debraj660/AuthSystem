import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";
import {User} from "../models/user.models.js"
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { sendAuthResponse } from "../utils/sendAuthResponse.js";
import ApiResponse from "../utils/ApiResponse.js";


const generateToken = async(userId) => {
    if(!userId){
        throw new ApiError(404, "user id is required");
    }

    const user = await User.findById(userId);

    if(!user) throw new ApiError(404, "user not found")

    const payload = {
        userId: user._id,
        email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({userId: user._id});
    

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    user.allRefreshTokens.push({ 
        token: refreshToken,
        createdAt: new Date(Date.now()),
        expiresAt: expiresAt,
    });
    await user.save();

    return { accessToken, refreshToken };
    
}; 


const register = asyncHandler(async(req, res)=>{
    let {fullName, email, username, password} = req.body;
    if(!fullName || !email || !username || !password) throw new ApiError(400, "All fields are required");
    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if(user) throw new ApiError(409, "username and email must be unique");

    const hashPass = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND))
    const newUser = await User.create({
        username,
        email,
        fullName,
        password: hashPass,
    });
    
    const {accessToken, refreshToken} = await generateToken(newUser._id);

    return sendAuthResponse(
        res,
        accessToken,
        refreshToken,
        "User registered and logged in succesfully",
        200
    );

});


const login = asyncHandler(async(req, res)=>{
    const {email, username, password} = req.body ;
    if((!email && !username )|| !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if(!user) throw new ApiError(404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) throw new ApiError(401, "Invalid Credential");

    const {accessToken, refreshToken} = await generateToken(user._id);

    return sendAuthResponse(
        res,
        accessToken,
        refreshToken,
        "User logged in successfully",
        200
    );

});


const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken ;

    if(!incomingRefreshToken){
        return res.status(401).json({message: "Please login again"})
    }

    const user = await User.findOne({
        "allRefreshTokens.token": incomingRefreshToken 
    });

    if(!user) throw new ApiError(404, "user not found with this refresh token");

    const tokenObj = user.allRefreshTokens.find(
        (it) => it.token === incomingRefreshToken
    );

    if (tokenObj.expiresAt.getTime() < Date.now())
    throw new ApiError(401, "Refresh token expired");

    user.allRefreshTokens = user.allRefreshTokens.filter((it) => it.token != incomingRefreshToken);
    await user.save() ;

    const {accessToken, refreshToken} = await generateToken(user._id) ;

    return sendAuthResponse(
        res,
        accessToken,
        refreshToken,
        "Token rotation done",
        200
    );
});


const logout = asyncHandler(async(req, res) => {
    const refreshToken = req.cookies.refreshToken ;
    if(!refreshToken) throw new ApiError(401, "Refresh token invalid");

    const user = await User.findOne({
        "allRefreshTokens.token" : refreshToken
    });

    if(!user) throw new ApiError(404, "user not found with this refresh token");

    user.allRefreshTokens = user.allRefreshTokens.filter((it) => it.token != refreshToken && it.expiresAt.getTime() >= Date.now());

    await user.save();

    res.clearCookie("accessToken") ;
    res.clearCookie("refreshToken") ;
    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});


const logoutAllDevices = asyncHandler(async(req, res) => {
    const refreshToken = req.cookies.refreshToken ;
    if(!refreshToken) throw new ApiError(401, "Invaide refresh token");

    const user = await User.findOne({
       "allRefreshTokens.token" : refreshToken
    }) ;
    if(!user) throw new ApiError(404, "User not found with this token");

    user.allRefreshTokens = [] ;
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse(200, {}, "Logged out from all devices successfully"));

});


export {register, login, logout, logoutAllDevices, refreshAccessToken} ;