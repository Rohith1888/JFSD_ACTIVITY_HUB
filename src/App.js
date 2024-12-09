import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import './components/css/Admin_Module/AdminHome.css';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './components/Home';
import Events from './components/Events';
import Clubs from './components/Clubs';
import Sports from './components/Sports';
import Contact from './components/Contact';
import LoginForm from './components/LoginForm';
import Sidebar from './components/Admin_module/SideBar';
import Overview from './components/Admin_module/Overview';
import AllStudents from './components/Admin_module/AllStudents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SignUpForm from './components/SignUpForm';
import PrivateRoute from './components/PrivateRoute';
import AllClubs from './components/Admin_module/AllClubs';
import ProfilePage from './components/ProfilePage';
import ForgotPassword from './components/ForgotPassword';
import AllEvents from './components/Admin_module/AllEvents';
import Organizer from './components/Organizer';
import MyEventsPage from './components/MyEvents';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimeoutRef = useRef(null);

  // Handle user logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/signin');
  }, [navigate]);

  // Reset inactivity timeout
  const resetTimeout = useCallback(() => {
    clearTimeout(inactivityTimeoutRef.current);
    if (user) {
      inactivityTimeoutRef.current = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000); // 15 minutes
    }
  }, [user, handleLogout]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => clearTimeout(inactivityTimeoutRef.current);
  }, []);

  // Fetch user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Track user activity to reset timeout
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimeout));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [resetTimeout]);

  // Handle navigation based on user role and path
  useEffect(() => {
    if (user) {
      if (location.pathname.startsWith('/admin') && user.role !== 'admin') {
        navigate('/');
      } else if (!location.pathname.startsWith('/admin') && user.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [location.pathname, user, navigate]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <>
      {location.pathname.startsWith('/admin') && user?.role === 'admin' ? (
        <div className="admin-container">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} />
          <div className="main-content">
            <Routes>
              <Route path="/admin" element={<Overview  />} />
              <Route path="/admin/overview" element={<Overview />} />
              <Route path="/admin/all" element={<AllStudents />} />
              <Route path="/admin/all-clubs" element={<AllClubs />} />
              <Route path="/admin/all-events" element={<AllEvents />} />
            </Routes>
          </div>
        </div>
      ) : (
        <>
          <Navbar user={user} isLoggedIn={!!user} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<PrivateRoute element={Events} isLoggedIn={!!user} />} />
            <Route path="/clubs" element={<PrivateRoute element={Clubs} isLoggedIn={!!user} />} />
            <Route path="/sports" element={<PrivateRoute element={Sports} isLoggedIn={!!user} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<LoginForm setUser={setUser} />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="/organizer" element={<Organizer user={user} />} />
            <Route path="/leaderboard" element={<MyEventsPage />} />
            <Route path="/my-events" element={<MyEventsPage user={user} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
