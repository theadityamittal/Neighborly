import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser, getUserInformation } from '../../../services/authService';
import {
  login,
  storeUserInformation,
  selectAuth
} from '../../../redux/authSlice';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [registrationMessage, setRegistrationMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Pull these from your Redux store:
  const { loading, error, access } = useSelector(selectAuth);
  const isAuthenticated = Boolean(access);

  // Show registration‐success banner if routed here after signup
  useEffect(() => {
    if (location.state?.message) {
      setRegistrationMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // When we become authenticated, redirect to bulletin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/bulletin');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      // 1️⃣ Get tokens
      const {
        data: { access, refresh },
      } = await loginUser(formData);

      dispatch(login({ access, refresh }));
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // 2️⃣ Fetch the user profile using the new access token
      const { data: user } = await getUserInformation(access);
      dispatch(storeUserInformation(user));

      // 3️⃣ Navigate
      navigate('/bulletin');
    } catch (err) {
      console.error('Login failed:', err);
      // You can also dispatch an action for error if you have one
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2>Welcome Back</h2>
        <p>Sign in to your neighborhood community</p>

        {registrationMessage && (
          <div className="success-message">{registrationMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
