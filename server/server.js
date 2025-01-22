import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv, { configDotenv } from "dotenv";
import connectDB from "../server/configs/mongoDB.js";

dotenv.config({
  path: ".env",
});

const app = express();
const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
    connectDB();
});
