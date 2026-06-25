import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://trackrv2-api.onrender.com/api",
  withCredentials: true,
});