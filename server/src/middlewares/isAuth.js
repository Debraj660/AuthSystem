import jwt from "jsonwebtoken";

const isAuth = async(req, res, next)=>{
    try{    
        const accessToken = req.cookies.accessToken ;
        if(!accessToken) {
            res.status(401).json({message: "Unauthorize", status: false});
        }

        const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) ;
        if(!payload){
            res.status(401).json({message : "Unauthorize", status: false});
        }

        req.user = {
            id: payload?.userId,
            email: payload?.email
        }

        next();

    }catch(error){
        console.log(error);
    }
};

export default isAuth ;