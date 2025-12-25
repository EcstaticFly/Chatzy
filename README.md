# 🚀 Chatzy – Real-Time Chat Application  

Chatzy is a **real-time chat platform** that enables users to **send messages, share images, and engage with an AI-powered chatbot**. Built with the **MERN stack, Socket.io, and Docker**, it offers **secure OTP authentication, user search, online status filtering, and customizable themes (32+ options)** for a seamless experience.  

🔗 **Live Demo:** [Chatzy](https://chatzy-mxp8.onrender.com/)  
📂 **Source Code:** [GitHub](https://github.com/EcstaticFly/Chatzy.git)  
🐳 **Docker Hub:** [suyash310/chatzy](https://hub.docker.com/u/suyash310)

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
- **Backend:** Node.js, Express.js, MongoDB, Brevo-api    
- **Real-Time Communication:** Socket.io  
- **Authentication:** OTP Verification  
- **AI Integration:** Gemini API  
- **Media Management:** Cloudinary  
- **Deployment:** Docker, Render    

---

## 🚀 Installation & Setup

Choose one of the following methods based on your needs:

### 📋 Prerequisites
- **Node.js** (v18 or higher) - Required for Method 1
- **Docker & Docker Compose** - Required for Methods 2 & 3
- **MongoDB** - Local installation or MongoDB Atlas account
- **Cloudinary Account** - For image uploads
- **Brevo Account** - For OTP email delivery
- **Google Gemini API Key** - For AI chatbot

---

## Method 1: 🖥️ Local Development (without Docker)

**Best for:** Active development and debugging

### Setup Steps

**1. Clone the repository**
```bash
git clone https://github.com/EcstaticFly/Chatzy.git
cd Chatzy
```

**2. Setup Server**
```bash
cd server
npm install

# Create .env file
touch .env
```

**3. Configure server/.env**
```env
MONGODB_URL=your_mongodb_url
CORS_ORIGIN=your_cors_origin
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAIL_USER=your_mail_to_send_otp
BREVO_API_KEY=your_brevo_api_key
CHATBOT_API_KEY=your_gemini_chatbot_api_key
```

**4. Setup Client**
```bash
cd ../client
npm install
```

**5. Start the Application**

Open two terminal windows:

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client:**
```bash
cd client
npm run dev
```

**6. Access the Application**
- **Client:** http://localhost:5173
- **Server API:** http://localhost:5000

### Stop the Application
- Press `Ctrl + C` in both terminal windows

---

## Method 2: 🐳 Local Docker Development

**Best for:** Testing in containerized environment with source code access

### Setup Steps

**1. Clone the repository**
```bash
git clone https://github.com/EcstaticFly/Chatzy.git
cd Chatzy
```

**2. Configure Environment**
```bash
cd server
touch .env
```

**3. Configure server/.env**
```env
MONGODB_URL=your_mongodb_url
CORS_ORIGIN=your_cors_origin
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAIL_USER=your_mail_to_send_otp
BREVO_API_KEY=your_brevo_api_key
CHATBOT_API_KEY=your_gemini_chatbot_api_key
```

**4. Build and Start Containers**
```bash
cd ..  # Back to root directory
docker compose up --build
```

Or run in detached mode (background):
```bash
docker compose up --build -d
```

if already built once:
```bash
docker compose up -d
```

**5. Access the Application**
- **Client:** http://localhost:5173
- **Server API:** http://localhost:5000
- **MongoDB:** localhost:27017

### Stop Containers

```bash
# Stop and remove containers (keeps data)
docker compose down

# Stop and remove containers + volumes (deletes data)
docker compose down -v
```

---

## Method 3: 🚀 Production Deployment (Pre-built Images)

**Best for:** Quick deployment without source code, production environments

### Setup Steps

**1. Download Production Compose File (docker-compose.prod.yaml):** [Download](https://github.com/EcstaticFly/Chatzy/blob/main/docker-compose.prod.yaml)

```bash
# Create a directory
mkdir chatzy-app
cd chatzy-app

# Create docker-compose.prod.yaml inside this folder
```

**2. Create Environment Configuration**
```bash
mkdir server
cd server
touch .env
```

**3. Configure server/.env**
```env
MONGODB_URL=your_mongodb_url
CORS_ORIGIN=your_cors_origin
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAIL_USER=your_mail_to_send_otp
BREVO_API_KEY=your_brevo_api_key
CHATBOT_API_KEY=your_gemini_chatbot_api_key
```

**4. Pull and Start Containers**
```bash
cd ..  # Back to root directory
docker compose -f docker-compose.prod.yaml up -d
```

**5. Access the Application**
- **Client:** http://localhost:5173
- **Server API:** http://localhost:5000

### Stop Containers

```bash
# Stop and remove containers (keeps data)
docker compose down

# Stop and remove containers + volumes (deletes data)
docker compose down -v
```

---

## 🤝 Contributing  
Contributions, issues, and feature requests are welcome!  
Feel free to **fork** the repo and submit a **pull request**.  

## 📜 License  
This project is licensed under the **GNU GENERAL PUBLIC LICENSE v3**.

## 📬 Contact
For inquiries, reach out to me at [Suyash Pandey](mailto:suyash.2023ug1100@iiitranchi.ac.in).
