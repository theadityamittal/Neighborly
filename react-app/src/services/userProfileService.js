// ===== FINAL userProfileService.js =====
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// Fetch posts created by user (Bulletin posts)
export const getMyPosts = (user_id, accessToken) => {
  return axios.get(`${API_BASE_URL}/bulletin/`, {
    params: { user_id },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// Fetch requested services by user
export const getRequestedServicesByUser = (user_id, accessToken) => {
  return axios.get(`${API_BASE_URL}/services/`, {
    params: { requested_by: user_id },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// Fetch listed tools by user
export const getToolsByUser = (user_id, accessToken) => {
  return axios.get(`${API_BASE_URL}/tools/`, {
    params: { listed_by: user_id },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// Fetch signed petitions by user
export const getSignedPetitionsByUser = (user_id, accessToken) => {
  return axios.get(`${API_BASE_URL}/petitions/`, {
    params: { signed_by: user_id },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
