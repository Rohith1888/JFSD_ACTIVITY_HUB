import React from 'react';
import '../components/css/card.css';

const Card = ({ image, title, description , button_title="Register"}) => {
  const handleRegister = () => {
    alert('Registered successfully');
  };

  return (
    <div className="card-ev">
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image-ev" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <button className="card-button" onClick={handleRegister}>
          {button_title}
        </button>
      </div>
    </div>
  );
};

export default Card;
