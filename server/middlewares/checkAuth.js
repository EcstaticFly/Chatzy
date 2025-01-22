import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const verifyjwt = async (req, res, next) => {
  try {
    const giventoken = req.cookies.token;
    if (!giventoken)
      return res.status(401).json({ message: "Please login to access this" });
    const decoded = jwt.verify(giventoken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
