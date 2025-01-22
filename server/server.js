import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv, { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import connectDB from "../server/configs/mongoDB.js";

dotenv.config({
  path: ".env",
});

const app = express();
const PORT = process.env.PORT;

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
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
  connectDB();
});
