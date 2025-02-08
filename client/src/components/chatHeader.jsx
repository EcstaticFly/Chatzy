import { X } from "lucide-react";
import { chatStore } from "../store/chatStore.js";
import { authStore } from "../store/authStore.js";
import { useState } from "react";

const chatBotId = "67a5af796174659ba813c735";

export const ChatHeader = () => {
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const { selectedUser, setSelectedUser } = chatStore();
  const { onlineUsers } = authStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative cursor-pointer">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName}
                onClick={() => setOpenFullScreenImage(true)}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : selectedUser?._id === chatBotId ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
      {openFullScreenImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-3xl p-2 rounded-full bg-gray-700 hover:bg-red-600 transition"
            onClick={() => setOpenFullScreenImage(false)}
          >
            <X size={32} />
          </button>

          <img
            src={selectedUser?.profilePic || "/avatar.png"}
            alt="Full Screen"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
};
