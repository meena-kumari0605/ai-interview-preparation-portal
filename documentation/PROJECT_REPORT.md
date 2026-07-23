# PROJECT REPORT: InterviewAI – AI Powered Interview Preparation Portal

**Author**: Senior Software Engineering Team  
**Date**: July 23, 2026  
**Version**: 1.0.0 (Production Release)  

---

## 1. ABSTRACT

Modern software engineering recruitment processes demand rigorous technical domain knowledge, behavioral adaptability, algorithmic problem-solving capabilities, and optimized ATS-friendly resumes. Traditional interview preparation relies on static, non-interactive question lists or expensive 1-on-1 human coaching. **InterviewAI** is a comprehensive, production-grade AI-powered web portal built with React (Vite), Express.js (MVC), MongoDB, and Google Gemini AI. The portal features automated role-specific AI mock interviews, 7-dimension HR behavioral scoring, safe code execution testing for technical questions, ATS resume parsing, and personalized career growth roadmaps. The system delivers objective 0-score penalties for skipped or random answers, eliminating artificial feedback and ensuring high educational integrity.

---

## 2. INTRODUCTION

The rapid evolution of artificial intelligence enables interactive, candidate-tailored education and career preparation. InterviewAI bridges the gap between theoretical software engineering knowledge and practical interview execution. By leveraging multi-axis AI evaluation models and real-time execution engines, candidates receive instant feedback on communication clarity, technical completeness, professionalism, time complexity, and ATS compliance.

---

## 3. PROBLEM STATEMENT

Candidates preparing for technical software engineering interviews face critical obstacles:
1. **Lack of Dynamic Feedback**: Static question lists do not evaluate an candidate's specific verbal or written answers.
2. **Artificial & Over-Inflated Ratings**: Generic platforms often award high scores to incomplete or low-effort answers.
3. **Inaccessible Code Execution**: Candidates often practice coding without immediate test case validation or complexity profilers.
4. **ATS Unfriendly Resumes**: Job seekers fail initial resume screens due to hidden formatting issues or missing technical keywords.

---

## 4. OBJECTIVES

- Design and implement a scalable full-stack web portal using React (Vite) and Express.js MVC.
- Integrate independent AI prompt architecture for Mock Interviews, HR Behavioral Scenarios, Resume Parsing, and Roadmaps.
- Implement an automated code runner for JavaScript, Python, C++, and Java that checks candidate solutions against test suites without providing solution hints.
- Ensure strict answer scoring (0 points for skipped or gibberish answers).
- Containerize the application with Docker and Docker Compose for AWS App Runner deployment.

---

## 5. EXISTING SYSTEM VS PROPOSED SYSTEM

| Feature | Existing Systems | Proposed InterviewAI Portal |
| :--- | :--- | :--- |
| **Interactivity** | Static text cards / pre-recorded videos | Dynamic AI interviewer asking 1-by-1 questions |
| **Evaluation Accuracy** | Artificial generic pass/fail ratings | Objective 5-axis & 7-axis metric scoring |
| **Skip / Spam Handling** | Gives partial scores | Strict 0-score penalty enforcement |
| **Technical Coding** | Simple textboxes or hints panels | Code runner with test case execution & complexity profiler (No hints) |
| **Resume Analysis** | Manual resume review | Instant PDF/DOCX ATS keyword & score auditor |

---

## 6. METHODOLOGY

The development of InterviewAI followed Agile Software Engineering principles:
1. **Requirement Engineering**: Identified key preparation components (Mock, HR, Technical, Resume, Roadmap).
2. **Clean MVC Design**: Separated backend database models, route handlers, controllers, and AI services.
3. **Frontend UI Architecture**: Built a dark glassmorphic interface utilizing Tailwind CSS utility tokens and glass backdrop blurs.
4. **Integration Testing**: Verified API endpoints using automated payload assertion tests.

---

## 7. MODULES OVERVIEW

1. **Authentication Module**: Secure JWT token generation and bcrypt password hashing.
2. **Dashboard Analytics Module**: Aggregates total interview sessions, average candidate scores, progress indexes, and recent history.
3. **Mock Interview Module**: Generates role/company tailored questions and evaluates answers across 5 metrics (Communication, Confidence, Completeness, Professionalism, Relevance).
4. **HR Behavioral Module**: Assesses leadership, conflict resolution, teamwork, and problem-solving across 7 HR dimensions.
5. **Technical Code Runner Module**: Executes submitted code against test suites in JS, Python, C++, and Java. Displays test pass counts, compilation/runtime errors, and time/space complexity.
6. **ATS Resume Analyzer Module**: Parses PDF, DOC, and DOCX files to extract text, calculate ATS match score, identify missing domain keywords, and recommend portfolio projects.
7. **Career Roadmap Module**: Generates personalized learning paths, project ideas, skill targets, and free educational resources based on candidate goals.

---

## 8. WORKFLOW & SYSTEM ARCHITECTURE

```
                  [ User Interface Layer (React + Vite) ]
                                    │
                         (Axios + JWT Tokens)
                                    │
                                    ▼
                 [ Express.js Controller Layer (MVC) ]
     ┌───────────────────┼───────────────────┼──────────────────┐
     ▼                   ▼                   ▼                  ▼
[ mockController ]  [ hrController ]  [ technicalController ] [ resumeController ]
     │                   │                   │                  │
[ aiService ]       [ aiService ]     [ codeRunnerService ] [ resumeParser ]
     │                   │                   │                  │
     └───────────────────┴─────────┬─────────┴──────────────────┘
                                   ▼
                       [ MongoDB / Mongoose DB ]
```

---

## 9. DATABASE DESIGN

The MongoDB database comprises 5 primary collections:
1. **Users**: `_id`, `name`, `email`, `password`, `role`, `experienceYears`, `createdAt`.
2. **InterviewSessions**: `_id`, `user`, `type` (MOCK/HR), `role`, `company`, `questions`, `overallScore`, `createdAt`.
3. **TechnicalSubmissions**: `_id`, `user`, `problemId`, `language`, `code`, `passedCount`, `totalCount`, `timeComplexity`, `spaceComplexity`.
4. **ResumeAnalyses**: `_id`, `user`, `fileName`, `targetRole`, `atsScore`, `skills`, `missingKeywords`, `suggestedProjects`.
5. **CareerRoadmaps**: `_id`, `user`, `targetRole`, `currentSkills`, `learningPath`, `technologies`, `freeResources`.

---

## 10. TESTING & RESULTS

- **Unit Testing**: Verified prompt output formatting and JSON parsing robustness.
- **Answer Validation**: Confirmed that empty responses or string `"SKIP"` produce `overallScore: 0`.
- **Code Execution Verification**: Verified that correct algorithm implementations pass 100% of test cases and display `O(N)` / `O(1)` complexity profiler output.

---

## 11. ADVANTAGES & LIMITATIONS

### Advantages
- Production-ready scalable architecture.
- Objective, non-inflated candidate evaluation.
- Responsive dark glassmorphism design.
- Full containerization ready for cloud deployment.

### Limitations
- Requires active internet connection for online Gemini AI queries (uses deterministic fallback when offline).

---

## 12. CONCLUSION & FUTURE ENHANCEMENTS

InterviewAI delivers a complete, production-grade candidate interview preparation portal. Future enhancements include voice speech recognition, live peer mock rooms, and browser extensions.

---

## 13. REFERENCES
- Google Gen AI SDK Documentation: https://ai.google.dev/
- React 18 Documentation: https://react.dev/
- Express.js Guide: https://expressjs.com/
- IEEE Software Engineering Standards
