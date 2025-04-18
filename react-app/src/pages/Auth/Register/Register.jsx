import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../../services/authService';
import { selectAuth } from '../../../redux/authSlice';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    accountType: 'resident',  // ← default
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { loading } = useSelector(selectAuth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim())  newErrors.lastName  = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // you could add phoneNumber validation here if desired
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const userData = {
      name:        `${formData.firstName} ${formData.lastName}`,
      email:       formData.email,
      password:    formData.password,
      phone_number: formData.phoneNumber,
      address:     formData.address,
      neighborhood: formData.city,
      account_type: formData.accountType,   // ← now dynamic
    };

    try {
      await registerUser(userData);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrors({ email: 'Email already exists' });
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <h2>Create an Account</h2>
        <p>Join your neighborhood community</p>

        {errors.email && <div className="error-message">{errors.email}</div>}

        <form onSubmit={handleSubmit} className="register-form">

          {/* Name */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName" name="firstName" type="text"
                value={formData.firstName} onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName" name="lastName" type="text"
                value={formData.lastName} onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              value={formData.email} onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password & Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                value={formData.password} onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber" name="phoneNumber" type="text"
                value={formData.phoneNumber} onChange={handleChange}
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              id="address" name="address" type="text"
              value={formData.address} onChange={handleChange}
            />
          </div>

          {/* City (→ neighborhood) */}
          <div className="form-group">
            <label htmlFor="city">City / Neighborhood</label>
            <input
              id="city" name="city" type="text"
              value={formData.city} onChange={handleChange}
            />
          </div>

          {/* Account Type */}
          <div className="form-group">
            <label htmlFor="accountType">Account Type</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
            >
              <option value="resident">Resident</option>
              <option value="volunteer">Volunteer</option>
              <option value="ngo">NGO</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
