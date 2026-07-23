# InterviewAI – AI Powered Interview Preparation Portal

An enterprise-grade, production-ready AI-powered Interview Preparation Portal built with React (Vite), Node.js, Express.js (MVC), MongoDB, and Tailwind CSS with modern Dark Glassmorphic aesthetics.

---

## ⚡ Groq AI Setup Instructions

InterviewAI is integrated with **Groq AI** (`groq-sdk` with `llama-3.3-70b-versatile` model) for fast candidate evaluations.

1. Go to **Groq Console**: [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign in and click **Create API Key**.
3. Copy your key (`gsk_...`).
4. Paste your key in `server/.env`:
   ```env
   GROQ_API_KEY=gsk_your_key_here
   ```

---

## 🚀 Single Command Quickstart

Run the full-stack application (both React/Vite Frontend and Express Backend) from the project root:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Fullstack Application
```bash
npm run dev
```
- **React Frontend**: `http://localhost:5173`
- **Express Backend**: `http://localhost:5000`
