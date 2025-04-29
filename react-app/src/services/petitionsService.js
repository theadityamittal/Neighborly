import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getSignedPetitionsByUser = (user_id, accessToken) => {
  return axios.get(`${API_BASE_URL}/petitions/`, {
    params: { signed_by: user_id },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
