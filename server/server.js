import express from "express";
import dotenv, { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './configs/mongoDB.js'
import connectCloudinary from "./configs/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { app, server } from "./configs/socket.js";

dotenv.config({
  path: ".env",
});

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({limit:"5mb", extended:true}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
  connectDB();
  connectCloudinary();
});
