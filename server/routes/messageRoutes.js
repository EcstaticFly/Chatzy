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

router.get("/users", verifyjwt, getUsers);
router.get("/searchUsers", verifyjwt, searchUser);
router.get("/:id", verifyjwt, getMessages);
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
