import { generateToken } from "../configs/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import randomstring from "randomstring";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import { extractPublicId } from "cloudinary-build-url";
import dotenv, { config } from "dotenv";
config();

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
        message: "Account created successfully",
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
    res
      .status(200)
      .json({ user, message: "Profile Picture Updated Successfully!" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    if(!req.user.profilePic){
      return res.status(400).json({ message: "No profile picture to delete" });
    }
    const publicId = extractPublicId(req.user.profilePic);
    // console.log(publicId);
    const result = await cloudinary.uploader.destroy(publicId);
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: "" },
      { new: true }
    );
    await user.save();
    res
      .status(200)
      .json({ user, message: "Profile Picture Deleted Successfully!" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Some error occured, picture not deleted.",
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

const otpCache = {};

function generateOtp() {
  return randomstring.generate({ length: 6, charset: "numeric" });
}

async function sendOtp(email, otp) {
  try {
    const mailOptions = {
      from: "otp.shopex@gmail.com",
      to: email,
      subject: "Otp verification",
      text: `Your Shopex Otp for verification is ${otp}. DO NOT share it with anyone.`,
    };
    // console.log("h1");
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.SECRET_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    // console.log("h2");

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Error occured: ", error.message);
      else console.log("OTP sent successfully: ", info.response);
    });
    // console.log("h3");
    return true;
  } catch (e) {
    console.log("Otp sending fail.");
    return false;
  }
}

export const getOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOtp();
    otpCache[email] = await bcrypt.hash(otp, 10);

    const result = await sendOtp(email, otp);
    // console.log(email, otp);
    if (result) {
      res.cookie("otpCache", otpCache, {
        maxAge: 300000,
        httpOnly: true,
        secure: false,
      });
      res.status(200).json({ message: "OTP sent succesfully" });
    } else {
      res.status(400).json({ message: "Failed to send OTP." });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { formData, givenOTP } = req.body;
  const actualOTPCache = req.cookies.otpCache;
  const decodedOtp = await bcrypt.compare(
    givenOTP.trim(),
    actualOTPCache[formData.email]
  );
  if (!actualOTPCache) {
    return res.status(400).json({ message: "OTP expired." });
  }
  if (!actualOTPCache.hasOwnProperty(formData.email)) {
    return res.status(400).json({ message: "Email not found,try again" });
  }

  if (decodedOtp) {
    delete otpCache[formData.email];
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};
