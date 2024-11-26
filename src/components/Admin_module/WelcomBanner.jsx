import React from 'react';
import '../css/Admin_Module/WelcomeBanner.css';

const WelcomeBanner = ({user}) => {
  return (
    <div className="welcome-banner">
      <h2>Welcome,{user.fullName} </h2>
      <p>Manage your content efficiently and effectively.</p>
    </div>
  );
};

export default WelcomeBanner;