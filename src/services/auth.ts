import api from "./api";

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token: string;
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  registerStudent: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return null;
      }
      throw error;
    }
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },

  verifyEmail: async (data: { email: string; otp: string }) => {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  },

  forgetPassword: async (email: string) => {
    const response = await api.post("/auth/forget-password", { email });
    return response.data;
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  getGoogleLoginUrl: () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const redirectPath = encodeURIComponent("/dashboard");
    return `${apiUrl}/auth/login/google?redirect=${redirectPath}`;
  },
};
