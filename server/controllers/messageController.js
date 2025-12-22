import { getReceiverSocketId, io } from "../configs/socket.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

const chatBotId = "67a5af796174659ba813c735";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { fullName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    try {
      const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
        .select("-password");
      if (!users) {
        return res.status(404).json({ message: "No user found" });
      }
      res.status(200).json(users);
    } catch (e) {
      console.log(e.message);
      res.status(500).json({ message: "Failed to search user" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: id },
        { senderId: id, receiverId: currentUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    // console.log(receiverId);
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "chatzy/messages",
      });
      imageUrl = result.secure_url;
    }
    const message = await Message.create({
      text,
      senderId,
      receiverId,
      image: imageUrl,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    if (receiverId === chatBotId) {
      sendChatBotMessage({
        originalSenderId: senderId,
        prompt: text,
        imageUrl: imageUrl || null,
      });
    }
    res.status(201).json(message);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Failed to send message" });
  }
};

const sendChatBotMessage = async (data) => {
  try {
    const genAI = new GoogleGenAI({apiKey: process.env.CHATBOT_API_KEY});

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: data.prompt,
    });
    
    const message = await Message.create({
      text: result.text,
      senderId: chatBotId,
      receiverId: data.originalSenderId,
    });
    await message.save();

    const receiverSocketId = getReceiverSocketId(data.originalSenderId);

    if (data.originalSenderId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
  } catch (error) {
    console.error("ChatBot Error:", error.message);
    
    try {
      const errorMessage = await Message.create({
        text: "I'm currently unavailable due to high demand. Please try again in a few minutes.",
        senderId: chatBotId,
        receiverId: data.originalSenderId,
      });
      await errorMessage.save();

      const receiverSocketId = getReceiverSocketId(data.originalSenderId);
      if (data.originalSenderId) {
        io.to(receiverSocketId).emit("newMessage", errorMessage);
      }
    } catch (dbError) {
      console.error("Failed to save error message:", dbError.message);
    }
  }
};
