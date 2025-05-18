import express ,{urlencoded}from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config({})


const app = express();
const PORT = process.env.PORT || 3000;
app.get("/",function(req,res){
    res.send("Backend is up");
})

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
    origin:"http://localhost:5173",
    Credentials:true,
}
app.use(cors(corsOptions));

app.listen(PORT,()=>{
    console.log(`server listen at port ${PORT}`)
});