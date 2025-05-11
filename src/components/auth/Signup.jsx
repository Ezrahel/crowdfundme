import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const passwordRequirements = [
    { id: 'length', label: 'At least 8 characters', test: (pass) => pass.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', test: (pass) => /[A-Z]/.test(pass) },
    { id: 'lowercase', label: 'One lowercase letter', test: (pass) => /[a-z]/.test(pass) },
    { id: 'number', label: 'One number', test: (pass) => /\d/.test(pass) },
    { id: 'special', label: 'One special character', test: (pass) => /[!@#$%^&*]/.test(pass) }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear specific error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validate password requirements in real-time
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (!/^[a-zA-Z\s]{2,}$/.test(value)) {
          newErrors.fullName = 'Please enter a valid name';
        }
        break;
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username is required';
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
          newErrors.username = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
          newErrors.phone = 'Please enter a valid phone number';
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const validatePassword = (password) => {
    if (formData.confirmPassword && password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Validate all fields
    ['fullName', 'username', 'email', 'password'].forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    // Validate password requirements
    const passValid = passwordRequirements.every(req => req.test(formData.password));
    if (!passValid) {
      newErrors.password = 'Please meet all password requirements';
      isValid = false;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Validate terms
    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms and Conditions';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signup form submitted:', formData);
      // Add your signup logic here
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create An Account</h1>
          <p>Create an account to enjoy all the services without any ads for free!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Full Name"
                required
              />
            </div>
            {touched.fullName && errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Username"
                required
              />
            </div>
            {touched.username && errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Email Address"
                required
              />
            </div>
            {touched.email && errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Phone Number (Optional)"
              />
            </div>
            {touched.phone && errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="password-requirements">
              {passwordRequirements.map(req => (
                <div
                  key={req.id}
                  className={`requirement ${req.test(formData.password) ? 'met' : ''}`}
                >
                  {req.test(formData.password) ? <FaCheck /> : <FaTimes />}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="terms-section">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>
            {errors.terms && <div className="error-message">{errors.terms}</div>}

            <label className="terms-checkbox">
              <input
                type="checkbox"
                name="agreeToMarketing"
                checked={formData.agreeToMarketing}
                onChange={handleChange}
              />
              <span>I agree to receive marketing communications</span>
            </label>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>

          <div className="auth-switch">
            Already Have An Account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup; 