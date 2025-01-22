import User from "../models/user.js";

export const getUsers = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(users);
    }catch(e){
        console.log(e.message);
        res.status(500).json({ message: "Failed to fetch users" });
    }
}

export const getMessages = async(req,res)=>{
    try {
        const {id} = req.params;

    }catch(e){
        console.log(e.message);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}