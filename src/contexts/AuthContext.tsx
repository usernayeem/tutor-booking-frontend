"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN" | "SUPER_ADMIN";
  emailVerified?: boolean;
  needPasswordChange?: boolean;
  status?: string;
  Student?: {
    id: string;
    contactNumber: string | null;
    address: string | null;
    profilePhoto?: string | null;
  };
  Tutor?: {
    id: string;
    contactNumber: string | null;
    hourlyRate: number | null;
    experience: number | null;
    qualification: string | null;
    profilePhoto?: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response: any = await authService.getMe();
      if (response && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: any = await authService.getMe();
        if (response && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user session", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response: any = await authService.login(data);
      
      // Fetch full user profile with relations after login
      const profileResponse: any = await authService.getMe();
      const fullUser = profileResponse.data;
      
      setUser(fullUser);
      document.cookie = "isLoggedIn=true; path=/";
      toast.success("Successfully logged in!");
      const dashboardRoute = fullUser.role.toLowerCase();
      router.push(`/dashboard/${dashboardRoute}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Login failed";
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      const result: any = await authService.registerStudent(data);
      
      // Auto-login after successful registration
      const fullUser = result?.data?.user;
      if (fullUser) {
        setUser(fullUser);
        document.cookie = "isLoggedIn=true; path=/";
        toast.success("Registration successful!");
        const dashboardRoute = fullUser.role.toLowerCase();
        router.push(`/dashboard/${dashboardRoute}`);
      } else {
        toast.success("Registration successful! Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Registration failed";
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
      await authService.changePassword(data);
      toast.success("Password changed successfully");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to change password";
      toast.error(msg);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        changePassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
