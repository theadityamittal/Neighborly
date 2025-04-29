import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/tools/";

// Fetch tools listed by the user
export const getToolsByUser = (user_id, accessToken) => {
  return axios.get(API_BASE_URL, {
    params: { user_id: user_id },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
