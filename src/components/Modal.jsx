import React from "react";
import "../components/css/Modal.css";
import { ToastContainer } from "react-toastify";

const Modal = ({ isOpen, onClose, card, onJoin, onLeave, isUserMember }) => {
  if (!isOpen) return null;

  const handleAction = () => {
    if (isUserMember) {
      onLeave();
    } else {
      onJoin(card.id);
    }
  };

  return (
    <>
    <ToastContainer/>
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-container">
          {/* Left section: Image */}
          <div className="modal-left">
            <img
              src={`data:image/jpeg;base64,${card.clubImage}`}
              alt={card.name}
              className="modal-image-glow"
            />
            <button className="join-button" onClick={handleAction}>
              {isUserMember ? "Leave Club" : "Join Club"}
            </button>
          </div>
          {/* Right section: Club details */}
          <div className="modal-right">
            <h2 className="modal-heading">{card.name}</h2>
            <p className="modal-description">{card.description}</p>
            <p><strong>Venue:</strong> {card.venue || "Not specified"}</p>
            <p><strong>Founded:</strong> {card.founded || "N/A"}</p>
            <p><strong>Members:</strong> {card.members || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Modal;
