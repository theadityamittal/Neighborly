import axiosInstance from "../utils/axiosInstance";

// export const registerUser = async (userData) => {
//   try {
//     const response = await axiosInstance.post('/auth/register/', userData);
//     return response;

//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register/", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data);
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
    const response = await fetch('/auth/validate-token', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      await response.json();
    } else {
      // If token is invalid, log the user out
      localStorage.removeItem('token');
    }
  } catch (error) {
    localStorage.removeItem('token');
  }
};

export const getVerificationForm = async (token) => {
  try {
    const response = await axiosInstance.get('/documents/UserDocuments/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error(error);
  }
}

export const getVerificationStatus = async (token) => {
  try {
    const response = await axiosInstance.get('/auth/user/info/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.verified;
  }
  catch (error) {
    console.error(error);
  }
}

export const uploadVerificationForm = async (formData, token) => {
  try {
    const response = await axiosInstance.post('/documents/verificationDocument/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export const updateVerificationForm = async (formData, token) => {
  try {
    const response = await axiosInstance.put('/documents/verificationDocument/', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
  catch (error) {
    console.error(error);
  }
}