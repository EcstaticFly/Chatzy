import { Server } from "socket.io";
import express from "express";
import http from "http";
import {config} from 'dotenv';

config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CORS_ORIGIN],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export function getReceiverSocketId(userId){
  return onlineUsersSocketMap[userId];
}

const onlineUsersSocketMap = {};

io.on("connection",(socket)=>{
    console.log("a client connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId){
      onlineUsersSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers",Object.keys(onlineUsersSocketMap));

    socket.on("disconnect",()=>{
        console.log("a client disconnected", socket.id);
        delete onlineUsersSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(onlineUsersSocketMap));
    })
})

export {io,server,app};