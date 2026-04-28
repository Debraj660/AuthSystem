
import dotenv from "dotenv" ;
import app from "./app.js";
import connectDB from "./src/config/db.js";

dotenv.config({
    path: "./.env"
});

connectDB();

const PORT = process.env.PORT ; 

app.listen(PORT, ()=>{
    console.log(`App is listening on ${PORT}`);

})