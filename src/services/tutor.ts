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

  updateTutor: async (id: string, data: any) => {
    const response = await api.patch(`/tutors/${id}`, data);
    return response.data;
  },
};
