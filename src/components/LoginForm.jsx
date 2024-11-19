import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../components/css/LoginForm.css';
import logo from '../Assets/images/logo_new.png';
import ReCAPTCHA from 'react-google-recaptcha';
import { ToastContainer, toast } from 'react-toastify';

const LoginForm = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/'); // Redirect if already logged in
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!captchaVerified) {
      setError('Please complete the reCAPTCHA verification.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/login', { email, password });
      const user = response.data;

      if (user) {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);

        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'student') {
          toast.success('Login successful');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
       
      } else {
        setError('Invalid email or password');
        toast.error('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again later.');
      toast.error('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value) => {
    if (value) {
      setCaptchaVerified(true);
      setError('');
    } else {
      setCaptchaVerified(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="login-heading">Login to Activity Hub</h2>
      <form onSubmit={handleSubmit}>
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
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
            />
            <div className="password-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          <div className="forgot-password">
            <Link to="#">Forgot your password?</Link>
          </div>
        </div>
        <ReCAPTCHA
          sitekey="6LeQ6YIqAAAAAKt2oz-L4GftlTuAQTLU0BD4VUUT"
          onChange={handleCaptchaChange}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="signup-link">
        <p>Don't have an account? <Link to="/signup">Register</Link></p>
      </div>
    </div>
  );
};

export default LoginForm;
