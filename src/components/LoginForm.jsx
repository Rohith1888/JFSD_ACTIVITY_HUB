import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import '../components/css/LoginForm.css';
import logo from '../Assets/images/logo_new.png';

import { ToastContainer, toast } from 'react-toastify';
import BouncingDotsLoader from './BouncingDotsLoader';


const LoginForm = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

   

    try {
      const response = await axios.post('https://jfsdactivityhubbackend-production.up.railway.app/admin/login', { email, password });
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



  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
    <ToastContainer />
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h2 className="login-heading">Login to Activity Hub</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{width:'400px'}}>
          <label htmlFor="email">Email or Username</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com or username"
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
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </div>
       
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ?  <BouncingDotsLoader />: 'Login'}
        </button>
      </form>
      <div className="signup-link">
        <p>Don't have an account? <Link to="/signup">Register</Link></p>
      </div>
    </div>
    </>

  );
};

export default LoginForm;
