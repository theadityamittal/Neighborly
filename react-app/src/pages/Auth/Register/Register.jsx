import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../../services/authService';
import { selectAuth } from '../../../redux/authSlice';
import './Register.css';
import LocationPicker from '../../../components/LocationPicker/LocationPicker';
import defaultAvatar from '../../../assets/avatar.png'; 

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    city: '',
    neighborhood: '',
    zipCode: '',
    latitude: null,
    longitude: null,
    icon:null,
    accountType: 'resident',
  });
  const [errors, setErrors] = useState({});
  const [iconPreview, setIconPreview] = useState(null); // Add preview state

  const navigate = useNavigate();
  const { loading } = useSelector(selectAuth);
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    city,
    neighborhood,
    zipCode,
    latitude,
    longitude,
    icon,
    accountType,
  } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add icon change handler
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        setErrors({ ...errors, icon: 'File size must be less than 5MB' });
        return;
      }
      
      setFormData((prev) => ({ ...prev, icon: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous error
      if (errors.icon) {
        const { icon, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
  
    const userData = new FormData();
    userData.append('name', `${firstName} ${lastName}`);
    userData.append('email', email);
    userData.append('password', password);
    userData.append('phone_number', phoneNumber);
    userData.append('address', address);
    userData.append('city', city);
    userData.append('neighborhood', neighborhood);
    userData.append('zip_code', zipCode);
    userData.append('latitude', parseFloat(latitude.toFixed(6)));
    userData.append('longitude', parseFloat(longitude.toFixed(6)));
    userData.append('account_type', accountType);
    
    if (icon) {
      userData.append('icon', icon);
      console.log('Icon details:', {
        name: icon.name,
        size: icon.size,
        type: icon.type
      });
    }
  
    // Debug log FormData contents
    for (let [key, value] of userData.entries()) {
      console.log(key, value);
    }
  
    try {
      await registerUser(userData);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      console.error('Registration failed:', err);
      // Log the exact error response
      if (err.response) {
        console.error('Error response:', err.response.data);
      }
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

          {/* Address */}
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <LocationPicker 
              onLocationChange={({ latitude, longitude, locationName, neighborhood, zipCode, city }) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: parseFloat(latitude.toFixed(6)),
                  longitude: parseFloat(longitude.toFixed(6)),
                  address: locationName,
                  neighborhood: neighborhood,
                  zipCode: zipCode,
                  city: city,
                }));
              }}
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

          <div className="form-group">
            <label htmlFor="icon">Profile Picture (optional)</label>
            <input
              id="icon"
              name="icon"
              type="file"
              accept="image/*"
              onChange={handleIconChange}
            />
            {iconPreview && (
              <img 
                src={iconPreview} 
                alt="Preview" 
                style={{ width: '100px', height: '100px', marginTop: '10px', borderRadius: '50%' }}
              />
            )}
            {errors.icon && <span className="error-text">{errors.icon}</span>}
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
