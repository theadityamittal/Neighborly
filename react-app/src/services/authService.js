import { loginStart, loginSuccess, loginFailure, logout } from '../store/userSlice';

// Add the register user function
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Replace with your actual API call
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    // Registration successful but we don't log in automatically
    dispatch(logout());
    return await response.json();
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};

// Example login function
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Replace with your actual API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const userData = await response.json();
    
    // Save token to localStorage for persistence
    localStorage.setItem('token', userData.token);
    
    dispatch(loginSuccess(userData.user));
    return userData;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};

export const logoutUser = () => (dispatch) => {
  // Clear local storage
  localStorage.removeItem('token');
  dispatch(logout());
};

// Function to check if user is already logged in on page refresh
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
      dispatch(loginSuccess(userData.user));
    } else {
      // If token is invalid, log the user out
      dispatch(logout());
      localStorage.removeItem('token');
    }
  } catch (error) {
    dispatch(logout());
    localStorage.removeItem('token');
  }
};