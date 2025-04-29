import axiosInstance from "../utils/axiosInstance";

// Fetch signed petitions by user
export const getPetitionsByUser = (userId, token) => {
  return axiosInstance.get(`/api/petitions/?signed_by=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
