import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://ca-trackr.salmontree-f4468a82.swedencentral.azurecontainerapps.io/api",
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