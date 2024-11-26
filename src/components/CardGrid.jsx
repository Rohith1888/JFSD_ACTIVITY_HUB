import React, { useState, useEffect } from "react";
import Card from "./Card";
import Modal from "./Modal";
import "../components/css/CardGrid.css";

const CardsGrid = ({ cardsData, userClubId }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [clubStatus, setClubStatus] = useState(userClubId); // Track the user's current club ID

  // Sync clubStatus with userClubId whenever userClubId changes
  useEffect(() => {
    setClubStatus(userClubId);
  }, [userClubId]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const handleJoinClub = async (clubId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email || !clubId) {
      alert("User email or club ID is missing!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/student/${email}/join/${clubId}`,
        { method: "POST" }
      );

      const message = await response.text(); // API returns plain text messages
      if (message === "Student successfully joined the club.") {
        alert("Successfully joined the club!");
        setClubStatus(clubId); // Update state to reflect the joined club
        setSelectedCard(null); // Close modal
      } else {
        alert(message); // Display error message from the API
      }
    } catch (error) {
      console.error("Error joining club:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLeaveClub = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email) {
      alert("User email is missing!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/student/${email}/leave`,
        { method: "POST" }
      );

      const message = await response.text(); // API returns plain text messages
      if (message === "Student successfully left the club.") {
        alert("Successfully left the club!");
        setClubStatus(null); // Update state to reflect leaving the club
        setSelectedCard(null); // Close modal
      } else {
        alert(message); // Display error message from the API
      }
    } catch (error) {
      console.error("Error leaving club:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="cards-grid">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            image={`data:image/jpeg;base64,${card.clubImage}`}
            title={card.name}
            description={card.description}
            button_title={
              clubStatus === card.id ? "Leave Club" : "Join Club"
            }
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
      <Modal
        isOpen={!!selectedCard}
        onClose={closeModal}
        card={selectedCard}
        onJoin={handleJoinClub}
        onLeave={handleLeaveClub}
        isUserMember={selectedCard && clubStatus === selectedCard.id} // Check membership status
      />
    </div>
  );
};

export default CardsGrid;
