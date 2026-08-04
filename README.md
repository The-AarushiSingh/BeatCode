
# ⚡ BeatCode

> An AI-powered LeetCode-style coding platform with secure code execution, personalized learning analytics, and intelligent code assistance.

[![Live Demo](https://img.shields.io/badge/Live_Demo-https://beatcode--xi.vercel.app-6c63ff?style=for-the-badge&logo=vercel)](https://beatcode-xi.vercel.app)
[![API Status](https://img.shields.io/badge/API-https://beatcode--do9q.onrender.com-00b894?style=for-the-badge&logo=render)](https://beatcode-do9q.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-ff6b6b?style=for-the-badge)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Live Demo](#-live-demo)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Challenges & Solutions](#-challenges--solutions)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**BeatCode** is a comprehensive coding practice platform designed to help developers improve their problem-solving skills through interactive coding challenges, AI-powered assistance, and detailed performance analytics.

### Why BeatCode?

- **🚀 Learn by Doing**: Practice coding with real-world problems
- **🤖 AI-Powered Learning**: Get intelligent hints, code reviews, and explanations
- **📊 Track Progress**: Visualize your growth with detailed analytics
- **🎨 Beautiful Experience**: Modern UI with dark/light themes

---

## ✨ Key Features

### 🧠 Core Features

| Feature | Description |
|---------|-------------|
| **💻 Code Editor** | Monaco Editor (VS Code experience) with syntax highlighting |
| **🔒 Secure Execution** | Sandboxed code execution via JDoodle API (with Mock Mode) |
| **🤖 AI Assistant** | Groq-powered hints, code reviews, and explanations |
| **📊 Analytics** | Activity heatmap, time analysis, and progress tracking |
| **🏆 Gamification** | Leaderboard, solved problems tracking |
| **🌗 Theme Support** | Dark/Light mode toggle |

### 👤 User Features

- 🔐 **Authentication**: Secure JWT-based login/register
- 📈 **Dashboard**: Personalized progress overview
- 💾 **Submission History**: Track all your attempts
- ⭐ **Problem Solving**: Solve problems in multiple languages

### 👑 Admin Features

- ➕ **Create Problems**: Add new problems with test cases
- ✏️ **Update Problems**: Edit existing problems
- 🗑️ **Delete Problems**: Remove problematic content
- 🧪 **Test Cases**: Public + Hidden test case support

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Database (Cloud) |
| **JWT** | Authentication |
| **JDoodle API** | Code execution (with mock mode) |
| **Groq API** | AI-powered assistance |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React** | UI framework |
| **Redux Toolkit** | State management |
| **Vite** | Build tool |
| **Monaco Editor** | Code editor |
| **Axios** | HTTP client |
| **CSS-in-JS** | Styling |

### Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **MongoDB Atlas** | Cloud database |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                              │
│                    (Vercel - React + Redux)                    │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Login   │  │   Home   │  │ Problem  │  │ Dashboard│     │
│  │  Page    │  │   Page   │  │   Page   │  │   Page   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              AI Helper / Monaco Editor                 │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
│                        ▼                                       │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   Axios Client                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                               │
│                    (Render - Node.js/Express)                  │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Auth API   │  │  Problems API│  │ Submissions  │        │
│  │  /api/auth   │  │ /api/problems│  │  /api/submit │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  AI Service  │  │ JDoodle API  │  │    User DB   │        │
│  │   (Groq)     │  │  (Executor)  │  │  (MongoDB)   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://beatcode-xi.vercel.app](https://beatcode-xi.vercel.app) |
| **Backend API** | [https://beatcode-do9q.onrender.com](https://beatcode-do9q.onrender.com) |
| **Health Check** | [https://beatcode-do9q.onrender.com/health](https://beatcode-do9q.onrender.com/health) |
| **API Endpoint** | [https://beatcode-do9q.onrender.com/api](https://beatcode-do9q.onrender.com/api) |

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `john@beatcode.com` | `password123` |
| User | `student@beatcode.com` | `password123` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- JDoodle API credentials (optional, mock mode available)
- Groq API key (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/The-AarushiSingh/BeatCode.git
cd BeatCode

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_KEY=your_jwt_secret_key
JWT_SECRET=your_jwt_secret_key

# JDoodle
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Mock Mode
USE_MOCK=true  # Set to false to use real JDoodle
```

### Run Locally

```bash
# Start backend
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/check` | Check authentication status |

### Problem Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/problems` | Get all problems | None |
| `GET` | `/api/problems/:id` | Get problem by ID | None |
| `POST` | `/api/problems` | Create new problem | Admin |
| `PUT` | `/api/problems/:id` | Update problem | Admin |
| `DELETE` | `/api/problems/:id` | Delete problem | Admin |

### Submission Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/problems/:id/submit` | Submit a solution | User |
| `GET` | `/api/problems/user/solved` | Get solved problems | User |

### AI Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/problems/:id/hint` | Get AI hint | User |
| `POST` | `/api/problems/:id/review` | Get AI code review | User |
| `GET` | `/api/problems/:id/explanation` | Get AI explanation | User |
| `GET` | `/api/problems/recommendation` | Get problem recommendation | None |

---

## 📁 Project Structure

```
BeatCode/
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIHelper.jsx         # AI Assistant UI
│   │   │   ├── Heatmap.jsx          # Activity heatmap
│   │   │   └── TimeAnalysis.jsx     # Time analytics
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProblemPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Admin.jsx
│   │   ├── store/
│   │   │   ├── store.js             # Redux store
│   │   │   ├── authSlice.js         # Auth state
│   │   │   └── ProblemSlice.js      # Problems state
│   │   └── utils/
│   │       └── axiosClient.js       # API client
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── src/                             # Backend
│   ├── config/
│   │   ├── db.js                    # Database connection
│   │   └── redis.js                 # Redis connection
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── userProblem.js           # Problem CRUD
│   │   ├── userSubmission.js        # Submission logic
│   │   └── aiController.js          # AI endpoints
│   ├── middleware/
│   │   ├── adminMiddleware.js       # Admin auth
│   │   └── userMiddleware.js        # User auth
│   ├── models/
│   │   ├── user.js                  # User schema
│   │   ├── problems.js              # Problem schema
│   │   └── submissions.js           # Submission schema
│   ├── routes/
│   │   ├── userAuth.js              # Auth routes
│   │   └── prbCreator.js            # Problem routes
│   ├── services/
│   │   └── aiService.js             # Groq AI service
│   ├── utils/
│   │   └── jdoodleValidator.js      # Code execution
│   └── index.js                     # Server entry
│
├── .env                             # Environment variables
├── package.json
└── README.md
```

---

## 🚧 Challenges & Solutions

### 1. JDoodle API Rate Limits ⚠️

**Challenge:** JDoodle's free tier limits to **200 requests per day**, which was a significant bottleneck during development and testing.

**Solution:**
- **Mock Mode**: Implemented a `USE_MOCK` environment variable that bypasses JDoodle entirely
- **Graceful Fallback**: When rate limit is hit, the system falls back to mock mode
- **Developer Experience**: Mock mode allows uninterrupted development and testing

### 2. CORS Configuration 🌐

**Challenge:** Frontend (Vercel) couldn't communicate with backend (Render) due to CORS issues.

**Solution:**
- Configured CORS to allow multiple origins (localhost, Vercel, Render)
- Used environment variables for dynamic origin configuration

### 3. Code Editor Integration 📝

**Challenge:** Implementing a VS Code-like experience in the browser.

**Solution:**
- Integrated Monaco Editor (VS Code's editor)
- Added support for multiple languages (JavaScript, Python, Java, C++, Go, Rust)
- Implemented boilerplate code generation

---

## 🔮 Future Scope

### Short-Term (1-3 Months)

| Feature | Description |
|---------|-------------|
| 📹 **Video Explanations** | Upload and view solution videos (Cloudinary) |
| 💬 **Discussion Forums** | Community discussions for each problem |
| 📱 **Mobile App** | React Native mobile application |
| 🔔 **Notifications** | Email and in-app notifications |

### Medium-Term (3-6 Months)

| Feature | Description |
|---------|-------------|
| 🧠 **Smart Recommendations** | ML-based problem suggestions |
| 📊 **Advanced Analytics** | Detailed performance insights |
| 🎯 **Daily Challenges** | New problem every day |
| 🏆 **Contests** | Timed coding competitions |

### Long-Term (6-12 Months)

| Feature | Description |
|---------|-------------|
| 🤝 **Collaborative Coding** | Real-time pair programming |
| 📚 **Learning Paths** | Curated problem sets for skill levels |
| 🔒 **Enterprise Features** | Team management, SSO, reporting |
| 🌍 **Multi-language UI** | Support for multiple languages |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **JDoodle** - For providing the code execution API
- **Groq** - For the free AI API
- **Render** - For the free backend hosting
- **Vercel** - For the free frontend hosting
- **MongoDB** - For the free cloud database

---

## 📞 Contact

- **GitHub**: [@The-AarushiSingh](https://github.com/The-AarushiSingh)
- **Project Link**: [https://github.com/The-AarushiSingh/BeatCode](https://github.com/The-AarushiSingh/BeatCode)
- **Live Demo**: [https://beatcode-xi.vercel.app](https://beatcode-xi.vercel.app)

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ by Aarushi Singh**
