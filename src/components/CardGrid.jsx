import React, { useState, useEffect } from "react";
import Card from "./Card";
import Modal from "./Modal";
import "../components/css/CardGrid.css";
import { toast, ToastContainer } from "react-toastify";

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
      toast.error("User email or club ID is missing!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/student/${email}/join/${clubId}`,
        { method: "POST" }
      );

      const message = await response.text(); // API returns plain text messages
      if (message === "Student successfully joined the club.") {
        toast.success('Successfully joined the club!');
        setClubStatus(clubId); // Update state to reflect the joined club
        setSelectedCard(null); // Close modal
      } else {
        toast.error(message); // Display error message from the API
      }
    } catch (error) {
      console.error("Error joining club:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleLeaveClub = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
  
    if (!email) {
      toast.error("User email is missing!");
      return;
    }
  
    try {
      // Check if the user is organizing any events
      const eventsResponse = await fetch(`http://localhost:8080/student/${email}/organizingEvents`);
      const organizingEvents = await eventsResponse.json();
  
      if (organizingEvents.length > 0) {
        toast.error("Can't leave as you are the organizer for the club's events. Contact admin.");
        return; // Prevent leaving the club if the user is organizing events
      }
  
      // Proceed with leaving the club if no events are being organized
      const response = await fetch(
        `http://localhost:8080/student/${email}/leave`,
        { method: "POST" }
      );
  
      const message = await response.text(); // API returns plain text messages
      if (message === "Student successfully left the club.") {
        toast.success("Successfully left the club!");
        setClubStatus(null); // Update state to reflect leaving the club
        setSelectedCard(null); // Close modal
      } else {
        toast.error(message); // Display error message from the API
      }
    } catch (error) {
      console.error("Error leaving club:", error);
      toast.error("An error occurred. Please try again.");
    }
  };  

  return (
    <>
    <ToastContainer />
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
    </>
  );
};

export default CardsGrid;
