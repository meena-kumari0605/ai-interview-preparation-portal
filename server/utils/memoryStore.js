/**
 * Shared In-Memory Session Store for Volatile DB Fallback Mode
 * Ensures candidate interview statistics remain 100% accessible and immediate
 * even if MongoDB connection is temporarily offline.
 */
class SharedMemoryStore {
  constructor() {
    this.sessions = [];
    this.technicalSubmissions = [];
    this.resumeAnalyses = [];
    this.careerRoadmaps = [];
  }

  addSession(session) {
    this.sessions.unshift({ ...session, createdAt: session.createdAt || new Date() });
  }

  addTechnicalSubmission(sub) {
    this.technicalSubmissions.unshift({ ...sub, createdAt: sub.createdAt || new Date() });
  }

  addResumeAnalysis(analysis) {
    this.resumeAnalyses.unshift({ ...analysis, createdAt: analysis.createdAt || new Date() });
  }

  addCareerRoadmap(roadmap) {
    this.careerRoadmaps.unshift({ ...roadmap, createdAt: roadmap.createdAt || new Date() });
  }

  getUserStats(userId, userEmail) {
    const isMatch = (item) => {
      if (!item.user) return false;
      const uStr = item.user.toString();
      return (userId && uStr === userId.toString()) || (userEmail && uStr.toLowerCase() === userEmail.toLowerCase());
    };

    return {
      sessions: this.sessions.filter(isMatch),
      technicalSubmissions: this.technicalSubmissions.filter(isMatch),
      resumeAnalyses: this.resumeAnalyses.filter(isMatch),
      careerRoadmaps: this.careerRoadmaps.filter(isMatch)
    };
  }
}

const sharedMemoryStore = new SharedMemoryStore();
module.exports = sharedMemoryStore;
