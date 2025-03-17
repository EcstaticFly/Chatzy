# 🚀 Chatzy – Real-Time Chat Application  

Chatzy is a **real-time chat platform** that enables users to **send messages, share images, and engage with an AI-powered chatbot**. Built with the **MERN stack, Socket.io, and Docker**, it offers **secure OTP authentication, user search, online status filtering, and customizable themes (32+ options)** for a seamless experience.  

🔗 **Live Demo:** [Chatzy](https://chatzy-mxp8.onrender.com/)  
📂 **Source Code:** [GitHub](https://github.com/EcstaticFly/Chatzy.git)  

## ✨ Features  
- **💬 Real-Time Messaging** – Instant text & image sharing via **Socket.io**.  
- **🤖 AI Chatbot** – Integrated **Gemini API** for interactive conversations.  
- **🔍 User Search & Filters** – Find users and filter by **online status**.  
- **🔒 Secure Authentication** – **OTP-based verification** for enhanced security.  
- **🌆 Media Uploads** – Users can **update/delete profile images** via **Cloudinary**.  
- **🎨 Customization** – Choose from **32+ themes** with **Daisy UI & TailwindCSS**.  
- **🐳 Containerized with Docker** – Ensures **scalability and efficient deployment**.  

## 🛠 Tech Stack  
- **Frontend:** React.js, TailwindCSS, Daisy UI  
- **Backend:** Node.js, Express.js, MongoDB  
- **Real-Time Communication:** Socket.io  
- **Authentication:** OTP Verification  
- **AI Integration:** Gemini API  
- **Media Management:** Cloudinary  
- **Deployment:** Docker  

## 🚀 Installation & Setup  
1️⃣ **Clone the repository:**  
   ```bash
   git clone https://github.com/EcstaticFly/Chatzy.git
   cd Chatzy
   ```
2️⃣ **Configure environment variables**
```bash
#setup .env file for server
cd server
touch .env
#add in server/.env
MONGODB_URL=your_mongodb_url
CORS_ORIGIN=your_cors_origin
JWT_SECRET=your_jwt_secret
NODE_ENV = development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAIL_USER=your_mail_to_send_otp
SECRET_PASSWORD=app_password_for_mail
CHATBOT_API_KEY=your_gemini_chatbot_api_key
```

3️⃣ **Run Docker Command:**
```bash
#To start Chatzy
docker compose up --build -d

#if already built once
docker compose up -d

#To stop Chatzy
docker compose down
```

4️⃣ **The app will be live at http://localhost:5173**

## 🤝 Contributing  
Contributions, issues, and feature requests are welcome!  
Feel free to **fork** the repo and submit a **pull request**.  

## 📜 License  
This project is licensed under the **GNU GENERAL PUBLIC LICENSE v3**.

## 📬 Contact
For inquiries, reach out to me at [Suyash Pandey](mailto\:suyash.2023ug1100@iiitranchi.ac.in).