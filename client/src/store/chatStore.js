import { create } from "zustand";
import {axiosInstance} from '../configs/axios.js';
import {toast} from 'react-hot-toast'


export const chatStore = create((set,get)=>({
    messages: [],
    users: [],
    selectedUser:null,
    setSelectedUser: (user) => set({selectedUser: user}),
    isUsersLoading:false,
    isChatLoading:false,

    getUsers: async()=>{
        set({isUsersLoading:true});
        try{
            const response = await axiosInstance.get('/messages/users');
            set({users:response.data});
        }catch(e){
            console.log(e);
            toast.error(e.response.data.message)
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages: async(userId)=>{
        set({isChatLoading:true});
        try{
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages:response.data});
        }catch(e){
            console.log(e);
            toast.error(e.response.data.message);
        }finally{
            set({isChatLoading:false});
        }
    },

    sendMessage : async(messageData)=>{
        const {selectedUser, messages} = get();
        try{
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,response.data]});
        }catch(e){
            console.log(e);
            toast.error(e.response.data.message);
        }finally{
        }
    }
}))