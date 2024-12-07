import React from "react";
import "../components/css/Modal.css";

const ModalEvent = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-container">
          <div className="modal-left">
            <img src={card.image} alt={card.title} className="modal-image-glow" />
          </div>
          <div className="modal-right">
            <h2 className="modal-heading">{card.title}</h2>
            <p className="modal-description">{card.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEvent;
