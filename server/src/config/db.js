import mongoose from "mongoose";

const connectDB = async(req, res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected");
    }catch(e){
        console.log(`Error in connecting DB : ${e}`) ;
    }
};

export default connectDB ;