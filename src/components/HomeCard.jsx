import React from "react";
import "../components/css/homecard.css"; // Link to your stylesheet
import { Link } from "react-router-dom";

const HomeCard = ({ imageSrc, title, description , url}) => {
  return (
    <div className="card">
      <img src={imageSrc} alt={title} className="card-image" />
      <div className="card-info">
        <h2 className="card-title">{title}</h2>
        <p className="card-description">{description}</p>
        <Link to={url}><button className="register-button">Show more</button></Link>
      </div>
    </div>
  );
};

export default HomeCard;
