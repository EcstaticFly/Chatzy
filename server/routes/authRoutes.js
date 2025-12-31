import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  updateProfilePic,
  checkUser,
  getOtp,
  verifyOtp,
  deleteProfilePic
} from "../controllers/authController.js";
import { verifyjwt } from "../middlewares/checkAuth.js";
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or email already exists
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Update profile picture
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profilePic
 *             properties:
 *               profilePic:
 *                 type: string
 *                 description: Base64 encoded image
 *     responses:
 *       200:
 *         description: Profile picture updated
 *       400:
 *         description: Invalid input
 */
router.put("/update", verifyjwt, updateProfilePic);

/**
 * @swagger
 * /api/auth/check:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User data returned
 */
router.get("/check", verifyjwt, checkUser);

/**
 * @swagger
 * /api/auth/sendOtp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/sendOtp", getOtp);

/**
 * @swagger
 * /api/auth/verifyOtp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - formData
 *               - givenOTP
 *             properties:
 *               formData:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *               givenOTP:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post("/verifyOtp", verifyOtp);

/**
 * @swagger
 * /api/auth/deleteImage:
 *   delete:
 *     summary: Delete profile picture
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile picture deleted
 */
router.delete("/deleteImage",verifyjwt, deleteProfilePic);

export default router;
