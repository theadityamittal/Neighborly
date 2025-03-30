import { loginStart, loginSuccess, loginFailure, logout } from '../store/userSlice';
import { login } from '../redux/authSlice';
import axiosInstance from "../utils/axiosInstance";
import { useDispatch } from 'react-redux';

export const registerUser = async (userData) => {
  try {
    console.log(userData)
    const response = await axiosInstance.post('/auth/register/', userData);
    console.log(response);
    
  } catch (error) {
    console.error(error);
  }
};

export const loginUser = async (userData) => {
  try {
    console.log(userData);
    const response = await axiosInstance.post('/auth/login/', userData);

    return response;

  } catch (error) {
    console.error(error);
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