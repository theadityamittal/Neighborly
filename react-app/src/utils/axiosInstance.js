import axios from "axios";
import { store } from "../redux/store";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000, 
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        store.getState().auth.refresh
      ) {
        originalRequest._retry = true;
  
        try {
          const refreshToken = store.getState().auth.refresh;
  
          const res = await axios.post(
            API_URL + "/auth/token/refresh/",
            { refresh: refreshToken }
          );
  
          const newAccessToken = res.data.access;
  
          // Update the token in Redux store
          store.dispatch({
            type: "auth/setAccessToken",
            payload: newAccessToken,
          });
  
          // Update token on retry request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
  
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token expired", refreshError);
          // Optionally redirect to login
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
);

export default axiosInstance;