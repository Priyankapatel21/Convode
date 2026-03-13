# 🚀 Convode | AI-Powered Collaborative IDE

**Convode** is a next-generation, conversation-driven development environment. It combines the power of Generative AI with real-time collaboration and in-browser code execution to turn ideas into working applications instantly.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React-61dafb.svg)
![Node](https://img.shields.io/badge/backend-Node.js-339933.svg)
![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-orange.svg)

---

## ✨ Key Features

- **💬 Conversation-Driven Development:** Talk to Google Gemini (AI) to generate full-stack code, refactor logic, or fix bugs using natural language.
- **👥 Real-Time Collaboration:** Multi-user project syncing and chat powered by **Socket.io**. Build alongside your team in a shared workspace.
- **⚡ Instant Browser Preview:** Leveraging **WebContainers**, Convode runs a virtual Node.js environment directly in your browser. Install dependencies and see live updates without leaving the tab.
- **📂 Interactive File Explorer:** A custom-built file tree that allows you to view, edit, and save files with built-in syntax highlighting (Highlight.js).
- **🔒 Secure & Scalable:** Authenticated user sessions using JWT and state management with React Context API.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| Tailwind CSS | Styling |
| StackBlitz WebContainers | In-browser preview engine |
| Socket.io-client | Real-time communication |
| Axios | HTTP requests |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server runtime |
| MongoDB (Atlas) | Database |
| Redis (Upstash) | Caching & state |
| Google Generative AI (Gemini SDK) | AI integration |

---

## 🚀 Deployment

| Service | URL |
|---|---|
| 🌐 Live Frontend | [convode.vercel.app](https://convode.vercel.app) |
| 🔗 Backend API | [convode.onrender.com](https://convode.onrender.com) |

---

## ⚙️ Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Priyankapatel21/Convode.git
cd Convode
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` folder:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
JWT_SECRET=your_jwt_secret
GOOGLE_AI_KEY=your_gemini_api_key
```

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run Locally
```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm run dev
```

---

## 📖 Usage Guide

1. **Register / Login** — Create your account to start managing projects.
2. **Create a Project** — Start a new workspace.
3. **Collaborate** — Add teammates via their email in the side panel.
4. **Prompt the AI** — Type `@ai` followed by a request, e.g.: @ai build a basic login page with CSS
5. **Run & Preview** — Click **Run** to mount the AI-generated code into the WebContainer and see your live site in the preview pane.

---

<p align="center">Developed by <strong>Priyanka Patel</strong></p>
