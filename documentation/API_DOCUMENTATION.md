# API DOCUMENTATION – InterviewAI Backend REST APIs

Base URL: `http://localhost:5000/api`  
Authentication Header: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication APIs

### 1.1 Candidate Registration
- **Endpoint**: `POST /api/auth/register`
- **Auth Required**: No
- **Request Body**:
```json
{
  "name": "Alex Johnson",
  "email": "alex@example.com",
  "password": "password123",
  "role": "Full Stack Engineer",
  "experienceYears": 3
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "669e4f5a1234567890abcdef",
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "role": "Full Stack Engineer",
    "experienceYears": 3
  }
}
```

### 1.2 Candidate Login
- **Endpoint**: `POST /api/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Alex Johnson", "email": "alex@example.com" }
}
```

---

## 2. AI Mock Interview API

### Endpoint: `POST /api/mock-interview`
- **Auth Required**: Optional (Saves to candidate history if authenticated)

#### Action 1: Generate Question
- **Request Body**:
```json
{
  "action": "generate_question",
  "role": "Full Stack Developer",
  "company": "Google",
  "experience": "2",
  "difficulty": "Medium",
  "previousQuestions": []
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "question": "Explain how the React Virtual DOM diffing algorithm works and how keys optimize list re-rendering.",
    "category": "Technical Architecture & Design",
    "expectedKeyPoints": ["Virtual DOM reconciliation", "Fiber tree traversal", "Key stability"]
  }
}
```

#### Action 2: Evaluate Answer
- **Request Body**:
```json
{
  "action": "evaluate_answer",
  "question": "Explain how the React Virtual DOM diffing algorithm works...",
  "answer": "React creates a lightweight Virtual DOM tree in memory. When state updates, it generates a new tree and uses the diffing algorithm (reconciliation) to compute minimum changes needed for the real DOM.",
  "role": "Full Stack Developer",
  "experience": "2",
  "difficulty": "Medium"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "overallScore": 88,
    "metrics": {
      "communication": 90,
      "confidence": 85,
      "completeness": 85,
      "professionalism": 90,
      "relevance": 90
    },
    "strengths": ["Clear explanation of reconciliation", "Good terminology"],
    "weaknesses": ["Could mention key prop stability edge cases"],
    "betterAnswer": "An exemplary response would define key stability and O(N) heuristic comparison...",
    "followUpQuestion": "How does React Fiber enable incremental rendering and priority updates?"
  }
}
```

---

## 3. HR Behavioral Interview API

### Endpoint: `POST /api/hr-interview`
- **Auth Required**: Optional

#### Action 1: Generate Question
- **Request Body**: `{ "action": "generate_question", "role": "Senior Engineer", "experience": "3" }`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "question": "Tell me about a time you faced a major technical disagreement with a team member. How did you resolve it?",
    "category": "Behavioral & Soft Skills",
    "targetTrait": "Conflict Resolution & Teamwork"
  }
}
```

#### Action 2: Evaluate Answer
- **Request Body**:
```json
{
  "action": "evaluate_answer",
  "question": "Tell me about a time...",
  "answer": "We disagreed on whether to use SQL or NoSQL. I set up a benchmark proof-of-concept and presented data objectively to align the team.",
  "role": "Senior Engineer"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "overallScore": 85,
    "metrics": {
      "communication": 85,
      "confidence": 85,
      "professionalism": 90,
      "clarity": 85,
      "leadership": 80,
      "teamwork": 88,
      "problemSolving": 85
    },
    "feedback": "Great empirical approach to conflict resolution.",
    "keyTakeaway": "Demonstrates data-driven leadership."
  }
}
```

---

## 4. Technical Interview API

### 4.1 Get Problems List
- **Endpoint**: `GET /api/technical/problems`
- **Auth Required**: No
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "two-sum",
      "title": "Two Sum",
      "difficulty": "Easy",
      "category": "Arrays & Hashing",
      "description": "Given an array of integers nums and target..."
    }
  ]
}
```

### 4.2 Run / Submit Code
- **Endpoint**: `POST /api/technical`
- **Auth Required**: Optional
- **Request Body**:
```json
{
  "action": "run",
  "problemId": "two-sum",
  "language": "javascript",
  "code": "function twoSum(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const diff = target - nums[i]; if (map.has(diff)) return [map.get(diff), i]; map.set(nums[i], i); } return []; }"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "success": true,
    "passedCount": 3,
    "totalCount": 3,
    "compilationErrors": null,
    "runtimeErrors": null,
    "testResults": [
      { "testCaseNumber": 1, "input": "{\"nums\":[2,7,11,15],\"target\":9}", "expectedOutput": "[0,1]", "actualOutput": "[0,1]", "passed": true }
    ],
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "executionTimeMs": "1.25 ms"
  }
}
```

---

## 5. ATS Resume Analyzer API

### Endpoint: `POST /api/resume`
- **Auth Required**: Optional
- **Content-Type**: `multipart/form-data` or `application/json`
- **Request**: Form file field `resume` (PDF/DOCX) + text field `targetRole`.
- **Response (200 OK)**:
```json
{
  "success": true,
  "fileName": "Resume.pdf",
  "targetRole": "Full Stack Engineer",
  "data": {
    "atsScore": 82,
    "skills": ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
    "missingKeywords": ["Docker", "Kubernetes", "AWS", "TypeScript"],
    "strengths": ["Clear work experience breakdown"],
    "weaknesses": ["Missing quantitative metrics"],
    "suggestedProjects": ["Microservices E-Commerce Platform"],
    "recommendedCertifications": ["AWS Certified Developer Associate"],
    "careerSuggestions": ["Add quantitative metrics like % speed optimization."]
  }
}
```

---

## 6. Career Roadmap API

### Endpoint: `POST /api/roadmap`
- **Auth Required**: Optional
- **Request Body**:
```json
{
  "targetRole": "Senior Full Stack Engineer",
  "currentSkills": "React, JavaScript, HTML/CSS",
  "experience": "2"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "targetRole": "Senior Full Stack Engineer",
    "estimatedTimeframe": "6 Months",
    "learningPath": [
      {
        "phase": "Phase 1: Advanced Core Mastery",
        "duration": "4 Weeks",
        "topics": ["Async JS", "Data Structures"],
        "milestone": "Build solid algorithmic foundation"
      }
    ],
    "projects": [{ "name": "Distributed Queue System", "description": "..." }],
    "technologies": ["React", "Node.js", "Docker", "AWS"],
    "freeResources": [{ "name": "MDN Web Docs", "url": "https://developer.mozilla.org" }]
  }
}
```
