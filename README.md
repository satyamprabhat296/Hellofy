# 🚀 Hellofy

> **Hellofy** is a full-stack **real-time communication and collaboration platform** built with the **MERN Stack**. It combines **instant messaging**, **HD video conferencing**, **interest-based networking**, and an **integrated code editor** into a single application, making it an ideal platform for developers, students, and professionals to connect, collaborate, and learn together.

---

## 📖 Overview

Hellofy is a modern web application designed to provide a seamless communication experience while encouraging meaningful professional networking. Unlike traditional messaging platforms, Hellofy enables users to discover and connect with people who share similar technical interests, skills, and domains.

The application leverages **Stream.io** for low-latency video and chat services, ensuring reliable real-time communication. With secure **JWT authentication**, scalable backend architecture, and a responsive user interface, Hellofy demonstrates the implementation of modern full-stack development practices.

Whether it's collaborating on a coding problem, conducting a technical interview, mentoring a student, or simply connecting with like-minded developers, Hellofy offers an all-in-one solution.

---

## ✨ Features

### 🔐 Secure Authentication
- User registration and login
- JWT-based authentication
- Password encryption using Bcrypt
- Protected routes and APIs

### 💬 Real-Time Chat
- Instant one-to-one messaging
- Real-time message delivery
- Conversation history
- Online/offline user status
- Typing indicators

### 📹 HD Video Calling
- High-quality video and audio calls
- One-to-one and group meetings
- Camera and microphone controls
- Screen sharing support
- Seamless meeting experience powered by Stream.io

### 👥 Interest-Based User Matching
- Connect with users sharing similar interests
- Domain-based recommendations
- Expand your professional network

### 👤 User Profiles
- Customize personal information
- Upload profile pictures
- Add skills, bio, and interests
- Manage account settings

### 💻 Built-in Code Editor
- Write and share code directly within the platform
- Support for multiple programming languages
- Ideal for technical interviews and pair programming
- Collaborative coding experience

### 🔔 Smart Notifications
- Message notifications
- Incoming call alerts
- Connection updates
- Activity notifications

### 📱 Responsive UI
- Mobile-friendly design
- Optimized for desktop and tablets
- Clean and modern interface

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js
- 🔄 Redux
- 🎨 Tailwind CSS / Material UI
- 🌐 React Router
- 📡 Axios

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🔑 JWT Authentication
- 🔒 Bcrypt

### Database
- 🍃 MongoDB
- 📦 Mongoose

### Real-Time Services
- 🎥 Stream.io Video SDK
- 💬 Stream Chat SDK

---

## 🎯 Key Highlights

- ✅ Full-Stack MERN Application
- ✅ Secure JWT Authentication
- ✅ Real-Time Chat System
- ✅ HD Video Conferencing
- ✅ Interest-Based User Matching
- ✅ Integrated Code Editor
- ✅ Responsive Design
- ✅ Scalable REST API
- ✅ Clean and Modular Architecture

---

## 🏗️ Project Architecture

```
                ┌────────────────────┐
                │      React.js      │
                │    Frontend UI     │
                └─────────┬──────────┘
                          │
                     REST APIs
                          │
                ┌─────────▼──────────┐
                │     Express.js     │
                │    Node.js Server  │
                └─────────┬──────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
   MongoDB          JWT Authentication   Stream.io
 (User Data)        Secure Sessions     Chat & Video
```

---

## 📂 Project Structure

```
Hellofy/
│
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── utils/
│
├── server/                 # Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
├── package.json
├── README.md
└── .env
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/Hellofy.git
cd Hellofy
```

### Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **server** directory and configure the following variables:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

STREAM_API_KEY=your_stream_api_key

STREAM_API_SECRET=your_stream_api_secret
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm start
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🚀 Future Enhancements

- 🌙 Dark Mode
- 📞 Voice-Only Calls
- 🤖 AI Chat Assistant
- 🌍 Language Translation
- 📁 File & Document Sharing
- 🎙️ Meeting Recording
- 📅 Meeting Scheduling
- 👥 Team Workspaces
- 🔐 Two-Factor Authentication
- 📊 User Analytics Dashboard

---

## 💡 Use Cases

- 👨‍💻 Developer Networking
- 🤝 Pair Programming
- 🎯 Technical Interview Practice
- 👨‍🏫 Online Mentoring
- 🎓 Student Collaboration
- 💼 Professional Meetings
- 🌐 Community Building

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/YourFeature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/YourFeature
```

5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Your Name**

- GitHub: https://github.com/satyamprabhat296/Hellofy
- LinkedIn: https://www.linkedin.com/in/satyam-prabhat-singh-24a305314/

---

