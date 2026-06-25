import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://trackrv2-api.onrender.com/api",
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