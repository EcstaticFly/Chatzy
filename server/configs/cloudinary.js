import {v2 as cloudinary} from 'cloudinary';
import dotenv,{config} from 'dotenv';

config();

const connectCloudinary = async()=>{
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUDINARY_CLOUD_NAME
            ,api_key: process.env.CLOUDINARY_API_KEY
            ,api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log("Cloudinary connected");
    }catch(e){
        console.log(e.message);
    }
}

export default connectCloudinary;