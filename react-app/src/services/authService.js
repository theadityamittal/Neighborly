import axiosInstance from "../utils/axiosInstance";

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register/', userData);
    return response;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserInformation = async (token) => {
  if (!token) {
    return null;
  }
  try {
    const response = await axiosInstance.get('/auth/user/info/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response;

  } catch (error) {
    console.error(error);
  }
};

export const updateUserInformation = async (userData, token) => {
  try {
    const response = await axiosInstance.patch('/auth/update/', userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response;

  } catch (error) {
    console.error(error);
  }
}

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/login/', userData);

    return response;

  } catch (error) {
    console.error(error);
  }
};

// Function to check if user is already logged in on page refresh
// saved for reference later
export const checkAuthState = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) return;
  
  try {
    // Validate the token with your backend
    const response = await fetch('/api/auth/validate-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
    } else {
      // If token is invalid, log the user out
      localStorage.removeItem('token');
    }
  } catch (error) {
    localStorage.removeItem('token');
  }
};