import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // Import eye icons
import CircularProgress from '@mui/material/CircularProgress';
import './css/ForgotPassword.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(30);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setIsOtpSending(true);
    try {
      const response = await axios.post(
        'http://localhost:2001/student/sendOtpforgot',
        email,
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      );

      if (response.data === 'OTP Sent successfully') {
        toast.success('OTP sent to your email.');
        setOtpSent(true);
        setShowOtpField(true);
      } else if (response.data === 'Email does not exists') {
        toast.error('Email does not exists. Please use valid email.');
      } else {
        toast.error('Error sending OTP.');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsOtpSending(false);
    }
  };

  const handleResendOtp = () => {
    setOtp(Array(6).fill('')); // Clear OTP fields
    handleSendOtp();
  };

  useEffect(() => {
    let interval;
    if (otpSent && !otpVerified && showOtpField) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowOtpField(false); // Hide OTP input field
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpVerified, showOtpField]);

  const handleResendClick = () => {
    handleResendOtp();
    setTimer(30);
    setShowOtpField(true);
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:2001/student/verifyOtp', {
        email,
        otp: otp.join(''), // Combine OTP array into string
      });

      if (response.data === 'OTP verified successfully!') {
        toast.success('OTP verified successfully!');
        setOtpVerified(true);
      } else {
        setOtp(Array(6).fill('')); // Clear OTP fields
        toast.error(response.data);
      }
    } catch (error) {
      toast.error('Error verifying OTP. Please try again.');
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input field automatically
      if (value && index < otp.length - 1) {
        e.target.nextSibling?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      e.target.previousSibling?.focus(); // Focus previous input field
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleResetPassword = async () => {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    try {
      // Sending a POST request to the server to reset the password
      const response = await axios.post('http://localhost:2001/student/change', {
        email: email,
        password: newPassword, // Assuming 'newPassword' contains the updated password
// You can include other data if required (e.g., userId, email, etc.)
      });
  
      // Check response and display appropriate message
      if (response.data === 'Password Changed') {
        toast.success("Password reset successfully!");

      // Navigate to login after a delay of 2 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
      } else {
        toast.error("Error resetting password. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur during the API request
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>
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
          </div>

          <button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent || otpVerified || isOtpSending}
            className={`verify-label-forgot ${otpVerified ? 'verified' : otpSent ? 'sent' : ''}`}
          >
            {isOtpSending ? (
              <CircularProgress style={{ height: '20px', width: '20px', color: '#fff' }} />
            ) : otpVerified ? (
              'Verified'
            ) : otpSent ? (
              'OTP Sent'
            ) : (
              'Submit'
            )}
          </button>
        </div>

        {otpSent && !otpVerified && (
          <div className="form-group otp-container">
            {showOtpField ? (
              <>
                <label htmlFor="otp">Enter OTP</label>
                <div className="otp-inputs">
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="otp-box"
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                <button type="button" onClick={handleVerifyOtp} className="verify-button-forgot">
                  Verify OTP
                </button>
                <p className="timer">Enter OTP in {timer}s</p>
              </>
            ) : (
              <button type="button" onClick={handleResendClick} className="resend-otp">
                Resend OTP
              </button>
            )}
          </div>
        )}

        {otpVerified && (
          <div className="form-group password-container">
            <label htmlFor="new-password">New Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="new-password"
                placeholder="Enter new password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirm-password"
                placeholder="Confirm new password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="password-mismatch-error">Passwords do not match!</p>
            )}

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={newPassword !== confirmPassword}
              className={`reset-button ${newPassword !== confirmPassword ? 'disabled' : ''}`}
            >
              Reset Password
            </button>
          </div>
        )}
              <div className="login-link">
        <p>
          Back to <Link to="/signin">Log in</Link>
        </p>
      </div>
      </div>

    </>
  );
};

export default ForgotPassword;
