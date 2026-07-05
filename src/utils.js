import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";

export const axiosInstance = axios.create({
  baseURL: isDevelopment 
    ? "/api" 
    : "https://api.trackr-v2.me/api",
  withCredentials: true,
});

let accessToken = null;

export const setTokenInMemory = (token) => {
  accessToken = token;
};

export const getTokenFromMemory = () => {
  return accessToken;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);