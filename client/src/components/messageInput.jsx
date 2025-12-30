import { useRef, useState, useEffect } from "react";
import { chatStore } from "../store/chatStore";
import { X, Image, Send, Loader, FileText, Paperclip } from "lucide-react";
import { toast } from "react-toastify";

const chatBotId = "67a5af796174659ba813c735";

// File size limits (in MB)
const FILE_SIZE_LIMITS = {
  image: 3,
  document: 5,
};

export const MessageInput = () => {
  const { sendMessage, isSendingMessage, selectedUser } = chatStore();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const attachMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setShowAttachMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > FILE_SIZE_LIMITS.image * 1024 * 1024) {
      toast.error(`Image size must be less than ${FILE_SIZE_LIMITS.image}MB`);
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setShowAttachMenu(false);
  };

  const handleDocumentChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    if (file.size > FILE_SIZE_LIMITS.document * 1024 * 1024) {
      toast.error(
        `Document size must be less than ${FILE_SIZE_LIMITS.document}MB`
      );
      return;
    }

    setDocumentFile(file);
    setDocumentPreview({
      name: file.name,
      size: file.size,
      type: file.type,
    });
    setShowAttachMenu(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const removeDocument = () => {
    setDocumentFile(null);
    setDocumentPreview(null);
    if (documentInputRef.current) documentInputRef.current.value = null;
  };

  const handleAttachClick = () => {
    setShowAttachMenu(!showAttachMenu);
  };

  const handleImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleDocumentSelect = () => {
    documentInputRef.current?.click();
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!text.trim() && !imageFile && !documentFile) return;

    try {
      const formData = new FormData();
      if (text.trim()) formData.append("text", text.trim());
      if (imageFile) formData.append("image", imageFile);
      if (documentFile) formData.append("document", documentFile);

      await sendMessage(formData);

      setText("");
      setImageFile(null);
      setImagePreview(null);
      setDocumentFile(null);
      setDocumentPreview(null);
      if (imageInputRef.current) imageInputRef.current.value = null;
      if (documentInputRef.current) documentInputRef.current.value = null;
    } catch (error) {
      console.error("Message not sent.", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="image-preview"
              className="size-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Document Preview */}
      {documentPreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex items-center gap-2 p-2 bg-base-200 rounded-lg border border-zinc-700">
            <FileText className="size-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium truncate max-w-[200px]">
                {documentPreview.name}
              </p>
              <p className="text-xs text-zinc-500">
                {(documentPreview.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={removeDocument}
              className="size-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-error hover:text-error-content"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />

          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          <input
            type="file"
            className="hidden"
            accept=".pdf"
            ref={documentInputRef}
            onChange={handleDocumentChange}
          />

          {selectedUser._id !== chatBotId && (
            <div className="relative" ref={attachMenuRef}>
              <button
                type="button"
                className={`btn btn-circle ${
                  imagePreview || documentPreview ? "text-emerald-500" : "text-zinc-400"
                }`}
                onClick={handleAttachClick}
                title="Attach File"
              >
                <Paperclip size={20} />
              </button>

              {/* Attachment Menu */}
              {showAttachMenu && (
                <div className="absolute bottom-full mb-2 right-0 bg-base-200 rounded-lg shadow-lg border border-zinc-700 py-1 min-w-[160px] z-10">
                  <button
                    type="button"
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-base-300 transition-colors text-left"
                    onClick={handleImageSelect}
                  >
                    <Image size={18} className="text-emerald-500" />
                    <span className="text-sm">Image</span>
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 flex items-center gap-3 hover:bg-base-300 transition-colors text-left"
                    onClick={handleDocumentSelect}
                  >
                    <FileText size={18} className="text-blue-500" />
                    <span className="text-sm">PDF Document</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-circle btn-sm btn-primary"
          disabled={
            (!text.trim() && !imageFile && !documentFile) || isSendingMessage
          }
        >
          {isSendingMessage ? (
            <Loader size={22} className="animate-spin" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};
