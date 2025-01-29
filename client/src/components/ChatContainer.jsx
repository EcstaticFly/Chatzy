import { useEffect } from "react";
import { chatStore } from "../store/chatStore.js";
import { ChatHeader } from "./chatHeader.jsx";
import { MessageInput } from "./messageInput.jsx";
import { MessageSkeleton } from "./skeletons/messageSkeleton.jsx";
import { authStore } from "../store/authStore.js";
import { formatMessageTime } from "../configs/utils.js";

export default function ChatContainer() {
  const { getMessages, selectedUser, messages, isChatLoading } = chatStore();
  const { user } = authStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [getMessages, selectedUser._id]);

  if (isChatLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message?.senderId === user._id ? "chat-end" : "chat-start"}`}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message?.senderId === user._id
                      ? user?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile-pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message?.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message?.image && (
                <img
                  src={message?.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>

  );
}
