import axios from "axios";

const isProd = typeof window !== "undefined" 
  ? window.location.hostname !== "localhost"
  : process.env.NODE_ENV === "production";

const fallbackURL = isProd 
  ? "https://tutor-booking-backend.vercel.app/api/v1" 
  : "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || fallbackURL,
  withCredentials: true, // Important for better-auth or JWT cookies
});

export default api;
