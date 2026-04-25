import api from "./api";

export const adminService = {
  createTutor: async (payload: any) => {
    const response = await api.post("/users/create-tutor", payload);
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get("/subjects");
    return response.data;
  },

  getTutors: async () => {
    const response = await api.get("/tutors");
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get("/students");
    return response.data;
  },

  createAdmin: async (payload: any) => {
    const response = await api.post("/users/create-admin", payload);
    return response.data;
  },

  createSubject: async (data: FormData | any) => {
    // If sending FormData for multer
    const response = await api.post("/subjects", data);
    return response.data;
  },

  deleteSubject: async (id: string) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  updateTutor: async (id: string, payload: FormData | any) => {
    const response = await api.patch(`/tutors/${id}`, payload);
    return response.data;
  },

  updateStudent: async (id: string, payload: FormData | any) => {
    const response = await api.patch(`/students/${id}`, payload);
    return response.data;
  },

  updateUser: async (id: string, payload: any) => {
    const response = await api.patch(`/users/${id}`, payload);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  getAllUsers: async (page = 1, limit = 10, searchTerm = "") => {
    const query = new URLSearchParams();
    if (page) query.append("page", page.toString());
    if (limit) query.append("limit", limit.toString());
    if (searchTerm) query.append("searchTerm", searchTerm);
    
    const response = await api.get(`/admin/users?${query.toString()}`);
    return response.data;
  },

  updateUserStatus: async (id: string, payload: any) => {
    const response = await api.patch(`/admin/users/${id}/status`, payload);
    return response.data;
  },

  deleteTutor: async (id: string) => {
    const response = await api.delete(`/tutors/${id}`);
    return response.data;
  },

  deleteStudent: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  getSchedules: async (page = 1, limit = 10) => {
    const response = await api.get(`/schedules?page=${page}&limit=${limit}`);
    return response.data;
  },

  createSchedules: async (payload: any) => {
    const response = await api.post("/schedules", payload);
    return response.data;
  },

  deleteSchedule: async (id: string) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },

  getSessions: async () => {
    const response = await api.get("/sessions");
    return response.data;
  },

  getSessionById: async (id: string) => {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  },

  updateSessionStatus: async (id: string, payload: any) => {
    const response = await api.patch(`/sessions/${id}/status`, payload);
    return response.data;
  },
};
