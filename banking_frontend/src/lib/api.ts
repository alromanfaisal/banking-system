// src/lib/api.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Auto-attach Bearer token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Redirect to auth page if token is invalid/expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      
      // 🟢 DO NOT redirect if the 401 came from /login or /register
      const isAuthEndpoint = requestUrl.includes("/login") || requestUrl.includes("/register");

      if (!isAuthEndpoint) {
        localStorage.removeItem("token");
        window.location.href = "/auth?mode=signin";
      }
    }
    return Promise.reject(error);
  }
);

export default api;