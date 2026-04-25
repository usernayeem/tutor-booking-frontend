import api from "./api";

export const tutorService = {
  getAllTutors: async (params?: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    subjectId?: string;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    const response = await api.get("/tutors", { params });
    return response.data;
  },

  getTutorById: async (id: string) => {
    const response = await api.get(`/tutors/${id}`);
    return response.data;
  },

  // Fetch the currently logged-in tutor's own profile via /auth/me or /tutors/me
  getProfile: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update a tutor's profile; supports FormData for profile photo upload via Cloudinary
  updateProfile: async (id: string, data: FormData | Record<string, any>) => {
    const response = await api.patch(`/tutors/${id}`, data);
    return response.data;
  },

  // updateTutor alias for admin use
  updateTutor: async (id: string, data: FormData | Record<string, any>) => {
    const response = await api.patch(`/tutors/${id}`, data);
    return response.data;
  },

  getMasterSchedules: async () => {
    const response = await api.get("/schedules");
    return response.data;
  },

  getTutorSchedules: async () => {
    const response = await api.get("/tutor-schedules");
    return response.data;
  },

  createTutorSchedules: async (payload: { scheduleIds: string[] }) => {
    const response = await api.post("/tutor-schedules", payload);
    return response.data;
  },

  deleteTutorSchedule: async (tutorScheduleId: string) => {
    const response = await api.delete(`/tutor-schedules/${tutorScheduleId}`);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get("/sessions");
    return response.data;
  },

  getSessionById: async (sessionId: string) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
  },

  getReviews: async (tutorId: string) => {
    const response = await api.get(`/reviews/${tutorId}`);
    return response.data;
  },

  updateSessionStatus: async (sessionId: string, status: string) => {
    const response = await api.patch(`/sessions/${sessionId}`, { status });
    return response.data;
  },
};
