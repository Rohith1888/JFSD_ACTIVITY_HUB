import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../components/css/SignupForm.css';
import logo from '../Assets/images/logo_new.png';
import { CircularProgress } from '@mui/material';
import BouncingDotsLoader from './BouncingDotsLoader';


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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [timer, setTimer] = useState(30); // Timer starts at 30 seconds
  const [showOtpField, setShowOtpField] = useState(true); 

  const navigate = useNavigate();

  // Handle sending OTP to email
  const handleSendOtp = async () => {
    setIsOtpSending(true); // Show spinner
    try {
      const response = await axios.post('http://localhost:8081/student/sendOtp', email, {
        headers: { 'Content-Type': 'text/plain' },
      });

      if (response.data === 'OTP Sent successfully') {
        toast.success('OTP sent to your email.');
        setOtpSent(true); // Change button text
      } else if (response.data === 'Email already exists') {
        toast.error('Email already exists. Please use a different email.');
      } else {
        toast.error('Error sending OTP.');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsOtpSending(false); // Hide spinner
    }
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    setOtp(''); // Clear OTP field
    handleSendOtp(); // Resend OTP
  };
  useEffect(() => {
    let interval;
    if (otpSent && !otpVerified && showOtpField) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowOtpField(false); // Hide OTP field when timer hits 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Cleanup interval on unmount or re-render
  }, [otpSent, otpVerified, showOtpField]); 

  const handleResendClick = () => {
    handleResendOtp(); // Trigger the resend OTP logic
    setTimer(30); // Reset timer to 30 seconds
    setShowOtpField(true); // Show OTP field again
  };
  // Handle OTP verification
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8081/student/verifyOtp', {
        email,
        otp,
      });
      if (response.data === 'OTP verified successfully!') {
        toast.success('OTP verified successfully!');
        setOtpVerified(true);
      } else {
        setOtp(''); // Clear OTP field
        document.querySelectorAll('.otp-box').forEach((input) => (input.value = ''));
        toast.error(response.data);
      }
    } catch (error) {
      toast.error('Error verifying OTP. Please try again.');
    }
  };

  // Form submission
  const handleSubmit = async (event) => {
    event.preventDefault();



    if (!otpVerified) {
      toast.error('Please verify your email with the OTP.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      toast.error('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:8081/student/signup', {
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

      setFullName('');
      setIdNumber('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setPasswordStrength('');
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Password strength check
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  // Password confirmation
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  // Password visibility toggle
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Moderate';
    return 'Strong';
  };

  // Get progress bar value based on strength
  const getProgressBarValue = (strength) => {
    switch (strength) {
      case 'Weak':
        return 33;
      case 'Moderate':
        return 66;
      case 'Strong':
        return 100;
      default:
        return 0;
    }
  };
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
  
    // Ensure only numeric values are allowed
    if (/^\d$/.test(value) || value === '') {
      const otpArray = otp.split('');
      otpArray[index] = value;
      setOtp(otpArray.join(''));
  
      // Move to the next input box if a digit is entered
      if (value !== '' && index < 5) {
        const nextInput = document.querySelector(`.otp-box:nth-child(${index + 2})`);
        nextInput?.focus();
      }
    }
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const otpArray = otp.split('');
      otpArray[index] = '';
      setOtp(otpArray.join(''));
  
      // Move to the previous input box if backspace is pressed
      if (index > 0) {
        const prevInput = document.querySelector(`.otp-box:nth-child(${index})`);
        prevInput?.focus();
      }
    }
  };
  

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="signup-heading">Register for Activity Hub</h2>
      <form onSubmit={handleSubmit} style={{width: '500px'}}>
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
          <div className="email-verification-container">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="form-input"
              disabled={otpSent || otpVerified}
            />
           <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent || otpVerified || isOtpSending}
              className={`verify-label ${
                otpVerified ? 'verified' : otpSent ? 'sent' : ''
              }`}
              style={{
                backgroundColor: otpSent ? 'green' : '',
                color: otpSent ? '#fff' : '',
              }}
            >
              {isOtpSending ? (
                <CircularProgress
                  style={{ height: '20px', width: '20px', color: '#fff', marginRight: '8px' }}
                  sx={{
                    '--CircularProgress-trackThickness': '3px',
                    '--CircularProgress-progressThickness': '2px',
                    '--CircularProgress-size': '10px',
                  }}
                />
              ) : otpVerified ? (
                'Verified'
              ) : otpSent ? (
                'OTP Sent'
              ) : (
                'Verify'
              )}
            </button>

          </div>
        </div>
        {otpSent && !otpVerified && (
        <div className="form-group otp-container">
          {showOtpField ? (
            <>
              <label htmlFor="otp">Enter OTP</label>
              <div className="otp-inputs">
                {Array(6)
                  .fill('')
                  .map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="otp-box"
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="verify-button"
              >
                Verify OTP
              </button>
              <p className="timer">Enter OTP in {timer}s</p>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              className="verify-button resend-otp"
            >
              Resend OTP
            </button>
          )}
        </div>
      )}
       
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
          {!passwordMatch && (
            <div className="password-match no-match" style={{color: 'red'}}>Passwords do not match</div>
          )}
        </div>
        <button type="" className="submit-button" >
          {isSubmitting ? <BouncingDotsLoader /> : 'Register'}
        </button>
      </form>
      <div className="login-link">
        <p>
          Already have an account? <Link to="/signin">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
