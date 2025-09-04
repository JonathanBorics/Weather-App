import axios from "axios";

const API_BASE_URL = "http://localhost/Weather-App/backend/api";

// Axios instance létrehozása
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor a token hozzáadásához
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor a hibák kezeléséhez
// API interceptor módosítása
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
    // Device tracking hibák esetén ne zavarja a felhasználót
    if (error.config?.url?.includes("/device/")) {
      console.warn("Device tracking endpoint not available:", error.config.url);
      return Promise.resolve({ data: null });
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),
};

// Weather API calls
export const weatherAPI = {
  getGuestWeather: () => api.get("/guest/weather"),
  getFavorites: () => api.get("/cities/favorites"),
  addFavorite: (cityName) => api.post("/cities/favorites", { cityName }),
  deleteFavorite: (cityId) => api.delete(`/cities/favorites/${cityId}`),
  getArchive: (cityId) => api.get(`/weather/archive/${cityId}`),
};

// Admin API calls
export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  updateUserStatus: (userId, isActive) =>
    api.put(`/admin/users/${userId}/status`, { is_active: isActive }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getPopularityStats: () => api.get("/admin/stats/popularity"),
  getDeviceStats: () => api.get("/admin/device/stats"),
  getDeviceSessions: () => api.get("/admin/device/sessions"),
};

export default api;
