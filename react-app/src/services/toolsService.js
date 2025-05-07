import axiosInstance from "../utils/axiosInstance";

export const getToolsByUser = async (userId, token) => {
  return axiosInstance.get(`/tools/?owner_id=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
