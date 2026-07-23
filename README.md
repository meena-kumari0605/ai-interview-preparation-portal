# InterviewAI – AI Powered Interview Preparation Portal

An enterprise-grade, production-ready AI-powered Interview Preparation Portal built with React (Vite), Node.js, Express.js (MVC), MongoDB, and Tailwind CSS with modern Dark Glassmorphic aesthetics.

---

## ⚡ Groq AI Configuration Guide

InterviewAI uses **Groq Cloud API** (`groq-sdk` with `llama-3.3-70b-versatile` model) for fast, real-time AI evaluations. Follow these steps to set up your free Groq API Key:

1. Visit **Groq Console**: [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign in or create a free Groq account.
3. Click **Create API Key**.
4. Copy your generated API key (starts with `gsk_...`).
5. Open `server/.env` (created automatically on server start) and paste your key:
   ```env
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

---

## ⚡ Quickstart (Single Command Launch)

Run the entire application (both React/Vite Frontend and Express/Node Backend) with one command from the project root:

### 1. Install All Dependencies
```bash
npm install
```
*(Automatically installs root, client, and server dependencies)*

### 2. Start Application (Single Command)
```bash
npm run dev
```
- **Frontend (Vite)**: `http://localhost:5173`
- **Backend (Express)**: `http://localhost:5000`

---

## 🛠️ Project Scripts Summary

From the root directory:

| Command | Description |
| :--- | :--- |
| `npm install` | Installs root, client, and server dependencies automatically |
| `npm run dev` | Concurrently starts Express backend and Vite frontend |
| `npm run build` | Builds the client distribution bundle (`dist/`) |
| `npm run start` | Concurrently starts production server and client dev mode |

---

## 📁 Project Structure

```
ibm_new/
├── package.json               # Root package manager & single-command script launcher
├── client/                     # React Vite Frontend Application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express.js MVC Backend Application
│   ├── .env.example           # Template with GROQ_API_KEY=
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/              # AI Service using groq-sdk
│   ├── server.js
│   └── package.json
│
├── documentation/             # Complete Documentation Suite
└── docker-compose.yml         # Full Stack Docker Compose Setup
```
