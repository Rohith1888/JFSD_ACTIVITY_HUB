import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!location.pathname.startsWith('/admin') && <Footer />}
    </>
  );
};

export default Layout;