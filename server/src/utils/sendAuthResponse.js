import ApiResponse from "./ApiResponse.js";

export const sendAuthResponse = (res, accessToken, refreshToken, message, statusCode = 200) => {
    const cookiePayload = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * parseInt(process.env.MAX_AGE),
    };

    res.cookie("accessToken", accessToken, cookiePayload);
    res.cookie("refreshToken", refreshToken, cookiePayload);

    return res.status(statusCode).json(new ApiResponse(statusCode, {accessToken, refreshToken}, message));
};