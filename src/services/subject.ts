import api from "./api";

export const subjectService = {
  getAllSubjects: async () => {
    const response = await api.get("/subjects");
    return response.data;
  },
};
