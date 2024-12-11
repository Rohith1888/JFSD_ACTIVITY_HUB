import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import NotFound from './components/NotFound404';

const NotFound404 = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <NotFound size={20} isButton={false} />
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimeoutRef = useRef(null);
  const sessionTimeoutRef = useRef(null);

  // Handle user logout
  const handleLogout = useCallback(() => {
    clearTimeout(inactivityTimeoutRef.current);
    clearTimeout(sessionTimeoutRef.current);
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

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeout(inactivityTimeoutRef.current);
      clearTimeout(sessionTimeoutRef.current);
    };
  }, []);

  // Fetch user from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      // Start a strict 1-minute session timeout
      sessionTimeoutRef.current = setTimeout(() => {
        toast.error('Session timed out. You have been logged out.', {
          position: 'top-right',
          autoClose: 5000,
        });
        handleLogout();
      }, 45 * 60 * 1000); // 1 minute
    }
    setLoading(false);
  }, [handleLogout]);

  // Track user activity to reset inactivity timeout
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

  // Define all valid paths for 404 handling
  const validPaths = [
    '/',
    '/admin/overview',
    '/admin/all',
    '/admin/all-clubs',
    '/admin/all-events',
    '/forgot-password',
    '/signin',
    '/signup',
    '/profile',
    '/admin',
    '/events',
    '/clubs',
    '/sports',
    '/contact',
    '/organizer',
    '/leaderboard',
    '/my-events',
  ];
  if (!validPaths.includes(location.pathname)) {
    return <NotFound404 />;
  }

  return (
    <>
      <ToastContainer />
      {location.pathname.startsWith('/admin') && user?.role === 'admin' ? (
        <div className="admin-container">
          <button className="toggle-button" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} handleLogout={handleLogout} user={user} />
          <div className="main-content">
            <Routes>
              <Route path="/admin" element={<PrivateRoute element={Overview} isLoggedIn={!!user} />} />
              <Route path="/admin/overview" element={<PrivateRoute element={Overview} isLoggedIn={!!user} />} />
              <Route path="/admin/all" element={<PrivateRoute element={AllStudents} isLoggedIn={!!user} />} />
              <Route path="/admin/all-clubs" element={<PrivateRoute element={AllClubs} isLoggedIn={!!user} />} />
              <Route path="/admin/all-events" element={<PrivateRoute element={AllEvents} isLoggedIn={!!user} />} />
            </Routes>
          </div>
        </div>
      ) : (
        <>
          <Navbar user={user} isLoggedIn={!!user} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<LoginForm setUser={setUser} />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/profile" element={<PrivateRoute element={ProfilePage} user={user} setUser={setUser} isLoggedIn={!!user} />} />
            <Route path="/organizer" element={<PrivateRoute element={Organizer} user={user} isLoggedIn={!!user} />} />
            <Route path="/leaderboard" element={<PrivateRoute element={MyEventsPage} isLoggedIn={!!user} />} />
            <Route path="/my-events" element={<PrivateRoute element={MyEventsPage} user={user} isLoggedIn={!!user} />} />
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
