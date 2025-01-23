import {create} from 'zustand';
import {axiosInstance} from '../configs/axios'
export const authStore = create((set)=>({
    user: null,
    isLoggingIn : false,
    isRegistering : false,
    isUpdating: false,
    isLoading : true,

    checkAuth : async()=>{
        try{
            const response = await axiosInstance.get("/auth/check");
            set({user: response.data});
        }catch(error){
            console.log(error);
            set({user: null})
        }finally{
            set({isLoading: false});
        }
    },
}))