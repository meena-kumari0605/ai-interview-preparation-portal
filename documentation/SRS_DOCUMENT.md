# SOFTWARE REQUIREMENT SPECIFICATION (SRS)
## InterviewAI – AI Powered Interview Preparation Portal

**Document Standard**: IEEE 830 Standard Format  
**Version**: 1.0.0  
**Date**: July 23, 2026  

---

## 1. INTRODUCTION

### 1.1 Purpose
This Software Requirement Specification (SRS) document details the functional, non-functional, interface, and behavioral requirements for the **InterviewAI** portal.

### 1.2 Scope
InterviewAI is an automated web platform offering:
- Role-specific AI Mock Interviews
- 7-competency HR Behavioral Evaluations
- Code Execution Engine for Technical Assessment (No hints)
- ATS Resume Compatibility Parsing (PDF/DOCX)
- Customized Career Growth Roadmaps

### 1.3 Definitions and Acronyms
- **ATS**: Applicant Tracking System
- **JWT**: JSON Web Token
- **MVC**: Model-View-Controller
- **STAR**: Situation, Task, Action, Result methodology

---

## 2. GENERAL DESCRIPTION

### 2.1 Product Perspective
InterviewAI operates as an independent web application. The frontend communicates with the backend via RESTful APIs over HTTPS.

### 2.2 System Actors
1. **Candidate / Job Seeker**: Practicing interviews, uploading resumes, running code, and generating roadmaps.
2. **System Administrator**: Monitoring server health and system metrics.
3. **AI Evaluation Engine**: Assessing candidate answers and computing metric scores.

### 2.3 User Classes and Characteristics
- **Entry-Level Developers**: Seeking technical foundational questions and resume auditing.
- **Experienced Software Engineers**: Seeking high-difficulty mock interviews, system design scenarios, and ATS score tuning.

---

## 3. SPECIFIC REQUIREMENTS

## 3.1 Functional Requirements

### FR-01: Candidate Authentication & Authorization
- **FR-01.1**: The system shall register candidates with Name, Email, Password, Role, and Experience.
- **FR-01.2**: The system shall authenticate candidates using JWT tokens with a 7-day expiration.
- **FR-01.3**: The system shall hash passwords using `bcryptjs` before DB storage.

### FR-02: AI Mock Interview Module
- **FR-02.1**: The system shall collect Target Role, Company, Experience, and Difficulty.
- **FR-02.2**: The system shall ask 1 interview question at a time.
- **FR-02.3**: The system shall evaluate answers across 5 metrics: Communication, Confidence, Completeness, Professionalism, and Relevance.
- **FR-02.4**: The system shall assign an overall score of `0` if the candidate skips or inputs random gibberish text.

### FR-03: HR Behavioral Module
- **FR-03.1**: The system shall generate behavioral and situational HR questions.
- **FR-03.2**: The system shall evaluate responses across 7 dimensions: Communication, Confidence, Professionalism, Clarity, Leadership, Teamwork, and Problem Solving.

### FR-04: Technical Code Sandbox Module
- **FR-04.1**: The system shall provide problem selection, difficulty selection, and language selection (JS, Python, C++, Java).
- **FR-04.2**: The system shall execute submitted code against test suites and display passed count, failed count, compilation errors, and runtime errors.
- **FR-04.3**: The system shall compute time and space complexity metrics.
- **FR-04.4**: The system shall **NOT** provide AI hint panels, code explanations, or optimal solutions.

### FR-05: ATS Resume Analyzer Module
- **FR-05.1**: The system shall accept PDF, DOC, and DOCX resume uploads or raw text.
- **FR-05.2**: The system shall compute an ATS compatibility score, extract detected skills, identify missing domain keywords, and suggest portfolio projects.

### FR-06: Career Roadmap Generator Module
- **FR-06.1**: The system shall generate personalized learning paths, project ideas, required tech stacks, certifications, and free resources.

---

## 3.2 Non-Functional Requirements

### NFR-01: Performance & Latency
- AI evaluation responses shall be returned within < 3 seconds under normal network conditions.
- Code execution sandbox shall terminate code exceeding a 2000 ms execution threshold.

### NFR-02: Security
- Passwords must be salted and hashed (`bcrypt`).
- API requests to protected endpoints must validate the `Bearer <token>` Authorization header.

### NFR-03: Usability & UI Aesthetics
- The portal must implement a modern Dark Glassmorphism aesthetic.
- The UI shall be fully responsive across mobile, tablet, and desktop viewports.

### NFR-04: Portability & Deployment
- The entire stack must be containerized using Docker and compatible with AWS App Runner.

---

## 4. SYSTEM CONSTRAINTS & ASSUMPTIONS

### 4.1 Constraints
- Uploaded resume files must not exceed 10 MB.
- Technical code execution runs in an isolated sandbox.

### 4.2 Assumptions
- Candidates have modern web browsers (Chrome, Firefox, Edge, Safari) with JavaScript enabled.
