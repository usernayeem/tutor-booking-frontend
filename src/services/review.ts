import api from "./api";

export const reviewService = {
  getTutorReviews: async (tutorId: string) => {
    const response = await api.get(`/reviews/${tutorId}`);
    return response.data;
  },

  createReview: async (data: { sessionId: string; rating: number; comment?: string }) => {
    const response = await api.post("/reviews", data);
    return response.data;
  },
};
