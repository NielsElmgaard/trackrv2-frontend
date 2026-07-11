import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const axiosInstance = axios.create({
  baseURL: isLocalhost ? "/api" : "https://api.trackr-v2.me/api",
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
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response, // response success; just forward it
  async (error) => {
    const originalRequest = error.config;
    const urlToCheck = originalRequest.url || "";
    const isLoginRequest = urlToCheck.includes("login");
    const isRefreshRequest = urlToCheck.includes("refresh");
    if (
      error.response?.status === 401 &&
      !originalRequest._retry && // not already retrying as well
      !isLoginRequest && // Should not retry when login fails -> you're on the login page
      !isRefreshRequest // Should not retry when refresh token request fails
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${axiosInstance.defaults.baseURL}/v1/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newAccessToken = refreshResponse.data.accessToken;
        setTokenInMemory(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token er også ugyldigt. Der logges ud.",
          refreshError,
        );
        setTokenInMemory(null);

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // Different error
  },
);
