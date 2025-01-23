import express from "express";
import { verifyjwt } from "../middlewares/checkAuth.js";
import { getMessages, getUsers, sendMessage } from "../controllers/messageController.js";
const router = express.Router();

router.get('/users',verifyjwt,getUsers);
router.get('/:id',verifyjwt,getMessages);
router.post('/send/:id',verifyjwt,sendMessage);


export default router;
