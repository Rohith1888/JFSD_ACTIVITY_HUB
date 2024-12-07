import React from "react";
import "../components/css/Modal.css";
import { ToastContainer } from "react-toastify";

const ModalEvent = ({ isOpen, onClose, card, onRegister, onCancel, isUserRegistered }) => {
  if (!isOpen) return null;

  const handleAction = () => {
    if (isUserRegistered) {
      onCancel(card.id);
    } else {
      onRegister(card.id);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
          <div className="modal-container">
            <div className="modal-left">
              <img
                src={`data:image/jpeg;base64,${card.eventImage}`}
                alt={card.eventName}
                className="modal-image-glow"
              />
              <button className="join-button" onClick={handleAction}>
                {isUserRegistered ? "Cancel Registration" : "Register"}
              </button>
            </div>
            <div className="modal-right">
              <h2 className="modal-heading">{card.eventName}</h2>
              <p className="modal-description">{card.eventDescription}</p>
              <p><strong>Date:</strong> {card.eventDate}</p>
              <p><strong>Time:</strong> {card.eventTime}</p>
              <p><strong>Venue:</strong> {card.eventVenue}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEvent;
