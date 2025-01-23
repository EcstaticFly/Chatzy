import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfilePic,
  checkUser,
  getOtp,
  verifyOtp,
} from "../controllers/authController.js";
import { verifyjwt } from "../middlewares/checkAuth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/update", verifyjwt, updateProfilePic);
router.get("/check", verifyjwt, checkUser);
router.post("/sendOtp", getOtp);
router.post("/verifyOtp", verifyOtp);

export default router;
