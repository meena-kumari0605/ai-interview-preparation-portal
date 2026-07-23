# PRESENTATION CONTENT DECK – InterviewAI

---

## Slide 1: Title Slide
- **Title**: InterviewAI – AI Powered Interview Preparation Portal
- **Subtitle**: Enterprise-Grade Technical, HR, Code Sandbox, ATS Resume & Career Growth System
- **Presenter**: Engineering Team
- **Date**: July 2026

---

## Slide 2: The Problem Statement
- **Interview Anxiety & Uncertainty**: Candidates lack real-time feedback on answer quality and technical depth.
- **Inflated Feedback**: Existing tools provide generic praise or artificial scores.
- **ATS Filter Rejections**: Up to 75% of resumes fail initial ATS screens due to formatting and missing keywords.
- **Lack of Integrated Code Testing**: Candidates cannot practice code against test suites without non-realistic hint shortcuts.

---

## Slide 3: The Solution – InterviewAI
- **Dynamic AI Mock Interviews**: 1-by-1 role-tailored questions evaluated across 5 key metrics.
- **7-Dimension HR Evaluation**: Deep behavioral scoring on leadership, clarity, and teamwork.
- **Technical Code Sandbox**: Runs JavaScript, Python, C++, Java code against test cases with time/space complexity analysis (Zero AI hint panels).
- **ATS Resume Analyzer**: PDF/DOCX parsing for ATS score, missing keywords, and project ideas.
- **Personalized Career Roadmap**: Custom step-by-step learning paths with free resources.

---

## Slide 4: System Architecture & Tech Stack
- **Frontend**: React (Vite), React Router 6, Tailwind CSS, Dark Glassmorphism Aesthetics.
- **Backend**: Node.js, Express.js (MVC Pattern), JWT Auth, Multer, `pdf-parse`, `mammoth`.
- **AI Engine**: Google Gemini API (`@google/genai`) with offline intelligent fallback generator.
- **Database**: MongoDB with Mongoose Schema models.
- **Containerization**: Multi-stage Docker, Docker Compose, AWS App Runner deployment ready.

---

## Slide 5: System Workflow & Data Flow
1. Candidate signs in using JWT authentication.
2. Selects Target Role, Company, Experience, and Difficulty.
3. System generates question -> Candidate submits response -> AI evaluates 5/7 metrics.
4. If Skipped or Random Text: Automated `0 Score` assigned for evaluation integrity.
5. Code Sandbox executes candidate algorithm against test suite.

---

## Slide 6: Key Features & Demonstration
- **Mock Interview Demo**: Demonstrates dynamic question generation and 5-axis result breakdown.
- **Technical Sandbox Demo**: Code editor with test case matrix, execution speed (ms), and O(N) complexity metrics.
- **ATS Resume Audit Demo**: File upload -> ATS Match Score Gauge -> Keyword audit.

---

## Slide 7: Live Demo Flow Steps
1. Navigate to Home Page & view features showcase.
2. Sign in with demo credentials (`demo@interviewai.com`).
3. View Candidate Dashboard analytics and performance metrics.
4. Launch Mock Interview & answer technical question.
5. Solve "Two Sum" in Technical Interview Sandbox.
6. Upload PDF resume to test ATS score auditor.

---

## Slide 8: Future Scope & Conclusion
- Voice Speech-to-Text & Live Video AI avatar interviews.
- Peer-to-peer live mock rooms.
- **Conclusion**: InterviewAI offers a scalable, modular, end-to-end interview preparation portal.
