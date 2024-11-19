import React from 'react';
import '../css/Admin_Module/WelcomeBanner.css';

const WelcomeBanner = ({user}) => {
  return (
    <div className="welcome-banner">
      <h1>Welcome,{user.fullName} </h1>
      <p>Manage your content efficiently and effectively.</p>
    </div>
  );
};

export default WelcomeBanner;