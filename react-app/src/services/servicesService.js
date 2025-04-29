import axiosInstance from "../utils/axiosInstance";

export const getRequestedServicesByUser = async (userId, token) => {
    return axiosInstance.get(`/services/?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  