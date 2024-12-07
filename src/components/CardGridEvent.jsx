import React, { useState, useEffect } from "react";
import CardEvent from "./CardEvent";
import ModalEvent from "./ModalEvent";
import "../components/css/CardGrid.css";
import { toast, ToastContainer } from "react-toastify";

const CardGridEvent = ({ cardsData, userRegisteredEventIds }) => {
  const [registeredEvents, setRegisteredEvents] = useState(userRegisteredEventIds || []);
  const [clubNames, setClubNames] = useState({}); // Store club names by clubId
  const [selectedCard, setSelectedCard] = useState(null); // Define selectedCard state

  // Sync registeredEvents with userRegisteredEventIds whenever it changes
  useEffect(() => {
    setRegisteredEvents(userRegisteredEventIds);
  }, [userRegisteredEventIds]);

  // Fetch club name based on clubId for each event
  useEffect(() => {
    const fetchClubNames = async () => {
      try {
        const clubIds = [...new Set(cardsData.map(event => event.clubId))]; // Get unique clubIds
        console.log("Fetching club names for clubIds:", clubIds); // Debugging line
        const clubDataPromises = clubIds.map(async (clubId) => {
          try {
            const response = await fetch(`http://localhost:8080/admin/${clubId}`);
            if (response.ok) {
              const clubData = await response.json();
              console.log(`Fetched data for clubId ${clubId}:`, clubData); // Debugging line
              return { clubId, clubName: clubData.name };
            } else {
              console.error(`Failed to fetch data for clubId ${clubId}`); // Debugging line
              return null;
            }
          } catch (error) {
            console.error(`Error fetching data for clubId ${clubId}:`, error);
            return null;
          }
        });

        const clubDataArray = await Promise.all(clubDataPromises);
        const clubNameMap = {};
        clubDataArray.forEach((club) => {
          if (club) clubNameMap[club.clubId] = club.clubName;
        });
        console.log("Club names map:", clubNameMap); // Debugging line
        setClubNames(clubNameMap);
      } catch (error) {
        console.error("Error fetching club names:", error);
      }
    };

    if (cardsData.length > 0) {
      fetchClubNames();
    }
  }, [cardsData]);

  const handleCardClick = (card) => {
    setSelectedCard(card); // This should now work as setSelectedCard is defined
  };

  const closeModal = () => {
    setSelectedCard(null); // This should now work as setSelectedCard is defined
  };

  const handleRegisterEvent = async (eventId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email || !eventId) {
      toast.error("User email or event ID is missing!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/registrations/${email}/register/${eventId}`,
        { method: "POST" }
      );

      const message = await response.text();
      if (message === "Successfully registered for the event.") {
        toast.success(message);
        setRegisteredEvents((prev) => [...prev, eventId]); // Update registered events
        setSelectedCard(null); // Close modal
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCancelRegistration = async (eventId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email || !eventId) {
      toast.error("User email or event ID is missing!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/registrations/${email}/cancel/${eventId}`,
        { method: "POST" }
      );

      const message = await response.text();
      if (message === "Successfully canceled the registration.") {
        toast.success(message);
        setRegisteredEvents((prev) => prev.filter((id) => id !== eventId));
        setSelectedCard(null); // Close modal
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error canceling registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="cards-grid">
        {cardsData.map((card, index) => {
          const clubName = clubNames[card.clubId]; // Fetch the club name using the clubId
          console.log(`Rendering card with clubId ${card.clubId}:`, clubName); // Debugging line
          return (
            <CardEvent
              key={index}
              image={`data:image/jpeg;base64,${card.eventImage}`} // Assuming you pass event image in base64
              title={card.eventName}
              description={card.eventDescription}
              clubName={clubName} // Pass club name to CardEvent component
              button_title={registeredEvents.includes(card.id) ? "Cancel Registration" : "Register"}
              onClick={() => handleCardClick(card)}
            />
          );
        })}
      </div>
      <ModalEvent
        isOpen={!!selectedCard}
        onClose={closeModal}
        card={selectedCard}
        onRegister={handleRegisterEvent}
        onCancel={handleCancelRegistration}
        isUserRegistered={selectedCard && registeredEvents.includes(selectedCard.id)}
      />
    </>
  );
};

export default CardGridEvent;
