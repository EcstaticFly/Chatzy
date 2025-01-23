import { generateToken } from "../configs/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    await generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
      message: "Logged in successfully",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
    });

    if (newUser) {
      await generateToken(newUser._id, res);
      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePic: newUser.profilePic,
        message: "User created successfully",
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      message: "Logged out successfully!",
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePic } = req.body;
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Please provide a profile picture" });
    }
    let uploadImage = await cloudinary.uploader.upload(profilePic);
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadImage.secure_url },
      { new: true }
    );
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkUser = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
