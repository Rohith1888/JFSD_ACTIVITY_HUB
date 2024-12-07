import React from "react";
import CardEvent from "./CardEvent";
import "../components/css/CardGrid.css";

const CardGridEvent = ({ cardsData }) => (
  <div className="card-grid">
    {cardsData.length > 0 ? (
      cardsData.map((event) => (
        <CardEvent
          key={event.id}
          image={`data:image/jpeg;base64,${event.eventImage}`} // Default image if no event image is provided
          title={event.eventName}
          description={event.eventDescription}
          clubName={event.club.name} // Display the club name
        />
      ))
    ) : (
      <div>No events found for this category</div>
    )}
  </div>
);

export default CardGridEvent;
