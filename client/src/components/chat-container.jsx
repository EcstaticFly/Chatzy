import { useEffect, useRef, useState } from "react";
import { chatStore } from "../store/chatStore.js";
import { ChatHeader } from "./chatHeader.jsx";
import { MessageInput } from "./messageInput.jsx";
import { MessageSkeleton } from "./skeletons/messageSkeleton.jsx";
import { authStore } from "../store/authStore.js";
import { formatMessageTime } from "../configs/utils.js";
import { X, FileText, Download, ArrowUpRightFromSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatContainer() {
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    getMessages,
    selectedUser,
    messages,
    isChatLoading,
    listenIncomingMessage,
    stopListenIncomingMessage,
  } = chatStore();
  const { user } = authStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    listenIncomingMessage();
    return () => stopListenIncomingMessage();
  }, [
    getMessages,
    selectedUser._id,
    listenIncomingMessage,
    stopListenIncomingMessage,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDocumentClick = (e, url) => {
    e.preventDefault();
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

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
            className={`flex ${
              message?.senderId === user._id ? "justify-end" : "justify-start"
            }`}
            ref={messageEndRef}
          >
            <div
              className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                message?.senderId === user._id
                  ? "bg-primary text-primary-content"
                  : "bg-base-200"
              }`}
            >
              {message?.image && (
                <img
                  src={message?.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                  onClick={() => setSelectedImage(message)}
                />
              )}

              {message?.document && (
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    message?.senderId === user._id
                      ? "bg-primary-content/10 hover:bg-primary-content/20"
                      : "bg-base-300 hover:bg-base-300/80"
                  }`}
                  onClick={(e) => handleDocumentClick(e, message.document.url)}
                >
                  <div className="flex-shrink-0">
                    <FileText size={32} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {message.document.name || "Document"}
                    </p>
                    <p className="text-xs opacity-70">
                      {formatFileSize(message.document.size)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <ArrowUpRightFromSquare size={20} className="opacity-70" />
                  </div>
                </div>
              )}

              {message.text && (
                <div className="text-sm prose prose-sm max-w-none">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              )}
              <p
                className={`text-[10px] mt-1.5 ${
                  message?.senderId === user._id
                    ? "text-primary-content/70"
                    : "text-base-content/70"
                }`}
              >
                {formatMessageTime(message?.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <button
            className="absolute top-5 right-5 text-white text-3xl p-2 rounded-full bg-gray-700 hover:bg-red-600 transition"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <img
            src={selectedImage.image}
            alt="Full Screen"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}

      <MessageInput />
    </div>
  );
}
