import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";

import connectDB from "./utils/db.js";
import { app, server } from "./socket/socket.js";
import path from "path"

dotenv.config({});

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve()


app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname,"/frontend/dist")))
app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

server.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
  connectDB();
});
