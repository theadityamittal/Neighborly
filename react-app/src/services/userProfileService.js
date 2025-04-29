import axios from "axios";
const API_BASE_URL = "http://127.0.0.1:8000/";

export const getMyPosts = (userId, token) => {
  return axios.get(`${API_BASE_URL}/bulletin/`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getListedTools = (userId, token) => {
  return axios.get(`${API_BASE_URL}/tools/`, {
    params: { owner_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getRequestedServices = (userId, token) => {
  return axios.get(`${API_BASE_URL}/services/`, {
    params: { user_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getHostedEvents = (userId, token) => {
  return axios.get(`${API_BASE_URL}/events/`, {
    params: { organizer_id: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSignedPetitions = (userId, token) => {
  return axios.get(`${API_BASE_URL}/petitions/`, {
    params: { signed_by: userId },
    headers: { Authorization: `Bearer ${token}` },
  });
};
