import express from "express";
import cors from "cors" ;
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.route.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRouter);

app.get("/", (req, res)=>{
    res.send("Hello");
})

export default app ;