import axios from "axios";

const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const baseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

const api = axios.create({
     baseURL,
     withCredentials: true,
     headers: {
          "Content-Type": "application/json",
     },
});

api.interceptors.request.use((config) => {
     if (typeof window !== 'undefined') {
          const token = localStorage.getItem('admin_token');
          if (token) {
               config.headers.Authorization = `Bearer ${token}`;
          }
     }
     return config;
});

export { api };

export const useApi = () => api;
