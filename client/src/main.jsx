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
