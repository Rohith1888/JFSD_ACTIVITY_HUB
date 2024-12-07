import React from "react";
import "../components/css/card.css";

const CardEvent = ({ image, title, description, date, time, venue, button_title, onClick }) => {
  return (
    <div className="card-ev" onClick={onClick}>
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image-ev" />
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <p className="card-date">{date}</p>
        <p className="card-time">{time}</p>
        <p className="card-venue">{venue}</p>
        <button className="card-button" onClick={(e) => e.stopPropagation()}>
          {button_title}
        </button>
      </div>
    </div>
  );
};

export default CardEvent;
