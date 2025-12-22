import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        autoClose={3000}
        limit={1}
        theme="colored"
        pauseOnHover={false}
        closeButton={false}
      />
      <App />
    </BrowserRouter>
  </StrictMode>
);

// TODO(low priority): Add Latex support for messages via react-katex, rehype-katex, remark-math
// or some other similar library. This will allow users to send and view mathematical equations
// currently: tried to implemenet katex but it broke the css for the chat which contained any latex code.
// a weird blank space at the bottom of the screen appeared and kept increasing in size when new messages were sent that included latex.
// for chats without latex, the chat worked fine.

// Future:
// 1. Implement message reactions (like, love, laugh, etc.) using emojis.
// 2. Add typing indicators to show when the other user is typing.
// 3. Notify users of new messages when they are not actively viewing the chat.
// 4. Implement message read receipts to indicate when messages have been seen.
// 5. Group chats.
// 6. Voice messaging capabilities.
// 7. Message editing and deletion options for users(under certain time frame).
// 8. File sharing capabilities (documents, PDFs, etc.) in addition to images.
// 9. {Have no idea of this field, that's why i won't call it ultimate, rather optional} AI-powered chatbots for automated responses and assistance.
// ULTIMATE: Implement end-to-end encryption for messages to enhance privacy and security.