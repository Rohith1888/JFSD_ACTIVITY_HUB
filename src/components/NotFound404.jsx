import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/NotFound.css'; // Add this for styles

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <h1 className="not-found-title" style={{marginBottom:'50px'}}>
        <span>4</span>
        <span>0</span>
        <span>4</span>
        <span>!</span>
      </h1>
      <h2 className='not-found-title'>Page Not Found</h2>
      <button className="not-found-button" onClick={goToHome} style={{margin:'20px'}}>
        Home
      </button>
    </div>
  );
};

export default NotFound;
