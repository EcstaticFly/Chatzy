import express from "express";
import { verifyjwt } from "../middlewares/checkAuth.js";
import {
  getMessages,
  getUsers,
  searchUser,
  sendMessage,
} from "../controllers/messageController.js";
import { checkFileSize, upload } from "../configs/multer.js";
const router = express.Router();

/**
 * @swagger
 * /api/messages/users:
 *   get:
 *     summary: Get all users except current user
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", verifyjwt, getUsers);

/**
 * @swagger
 * /api/messages/searchUsers:
 *   get:
 *     summary: Search users by name or email
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term
 *     responses:
 *       200:
 *         description: List of matching users
 */
router.get("/searchUsers", verifyjwt, searchUser);

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Get messages with a specific user
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get("/:id", verifyjwt, getMessages);

/**
 * @swagger
 * /api/messages/send/{id}:
 *   post:
 *     summary: Send a message to a user
 *     tags: [Messages]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Receiver user ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post(
  "/send/:id",
  verifyjwt,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  checkFileSize,
  sendMessage
);

export default router;
