import Message from "../models/message.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";

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
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      imageUrl = result.secure_url;
    }
    const message = await Message.create({
      text,
      senderId,
      receiverId,
      image: imageUrl,
    });
    await message.save();
    res.status(201).json(message);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Failed to send message" });
  }
};
