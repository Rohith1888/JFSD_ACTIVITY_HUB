import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../components/css/SignupForm.css';
import logo from '../Assets/images/logo_new.png';
import ReCAPTCHA from 'react-google-recaptcha';

const SignUpForm = () => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!captchaVerified) {
      toast.error('Please complete the reCAPTCHA verification.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/signup', {
        email,
        fullName,
        idNumber,
        password,
      });

      if (response?.data === 'Email already exists') {
        toast.error('User already exists. Please use a different email.');
      } else if (response?.data === 'Student registered successfully') {
        let countdown = 3;
        const toastId = toast.success(
          `User Registered Successfully. You will be redirected to the Login Page in ${countdown} seconds.`,
          { autoClose: false }
        );

        const interval = setInterval(() => {
          countdown -= 1;
          toast.update(toastId, {
            render: `User Registered Successfully. You will be redirected to the Login Page in ${countdown} seconds.`,
          });
          if (countdown < 0) {
            clearInterval(interval);
            navigate('/signin');
          }
        }, 1000);
      }

      // Clear fields after submission
      setFullName('');
      setIdNumber('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPasswordStrength('');
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Moderate';
    return 'Strong';
  };

  const getProgressBarValue = (strength) => {
    switch (strength) {
      case 'Weak': return 33;
      case 'Moderate': return 66;
      case 'Strong': return 100;
      default: return 0;
    }
  };

  const handleCaptchaChange = (value) => setCaptchaVerified(!!value);

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="signup-heading">Register for Activity Hub</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number</label>
          <input
            type="text"
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Enter your ID number"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              required
              className="form-input"
            />
            <div className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          {password && (
            <div className="password-strength-container">
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password Strength: {passwordStrength}
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-bar-fill ${passwordStrength.toLowerCase()}`}
                  style={{ width: `${getProgressBarValue(passwordStrength)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your password"
              required
              className="form-input"
            />
            <div className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          {confirmPassword && (
            <div className={`password-match ${passwordMatch ? 'match' : 'no-match'}`}>
              {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
            </div>
          )}
        </div>
        <ReCAPTCHA
          sitekey="6LeQ6YIqAAAAAKt2oz-L4GftlTuAQTLU0BD4VUUT"
          onChange={handleCaptchaChange}
        />
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
      <div className="login-link">
        <p>Already have an account? <Link to="/signin">Log in</Link></p>
      </div>
    </div>
  );
};

export default SignUpForm;
