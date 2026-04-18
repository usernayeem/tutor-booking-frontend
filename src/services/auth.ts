import api from "./api";

// We will use these types eventually based on our backend
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    token: string;
  };
}

export const authService = {
  login: async (data: any) => {
    // For now, return a promise to simulate the backend. 
    // Uncomment the API call once the backend is running.
    /*
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
    */
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },

  registerStudent: async (data: any) => {
    /*
    const response = await api.post("/auth/register-student", data);
    return response.data;
    */
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },

  logout: async () => {
    /*
    const response = await api.post("/auth/logout");
    return response.data;
    */
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  getMe: async () => {
    /*
    const response = await api.get("/users/me");
    return response.data;
    */
    return null;
  }
};
