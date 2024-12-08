import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import CardGridEvent from "./CardGridEvent";
import ModalEvent from "./ModalEvent";
import "../components/css/events.css";

export default function Events() {
  const [events, setEvents] = useState([]); // Holds all events fetched from the API
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedEvent, setSelectedEvent] = useState(null); // Holds the selected event data for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState([]); // User's registered event ids

  // Fetch events and user's registered events
  useEffect(() => {
    const fetchEventsAndClubs = async () => {
      try {
        const eventsResponse = await fetch("https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllEvents");
        const eventsData = await eventsResponse.json();

        const eventsWithClubs = await Promise.all(
          eventsData.map(async (event) => {
            const clubResponse = await fetch(`https://jfsdactivityhubbackend-production.up.railway.app/admin/${event.clubId}`);
            const clubData = await clubResponse.json();
            return {
              ...event,
              club: clubData,
              image: `data:image/jpeg;base64,${event.eventImage}`, // Ensure event image is ready
            };
          })
        );

        setEvents(eventsWithClubs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events or clubs:", error);
        setLoading(false);
      }
    };

    // Fetch user's registered events
    const fetchUserRegisteredEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.email) {
        try {
          const response = await fetch(`https://jfsdactivityhubbackend-production.up.railway.app/registrations/${user.email}`);
          if (!response.ok) throw new Error("Failed to fetch user registered events");
          const data = await response.json();
          setUserRegisteredEventIds(data.map((event) => event.eventId));
        } catch (error) {
          console.error("Error fetching user registered events:", error);
        }
      }
    };

    fetchEventsAndClubs();
    fetchUserRegisteredEvents();
  }, []);

  const openModal = (event) => {
    setSelectedEvent({
      image: event.image,
      title: event.eventName,
      description: event.eventDescription,
      date: event.eventDate,
      time: event.eventTime,
      location: event.eventVenue,
      organizerEmail: event.organizerEmail,
      clubName: event.club.name,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Filter technical and non-technical events based on the club category
  const technicalEvents = events.filter((event) => event.club.category === "Tech");
  const nonTechnicalEvents = events.filter((event) => event.club.category === "Non-Tech");

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <>
      <Banner title1="Events" title2="" />

      <h2 className="center-heading">Technical Events</h2>
      {technicalEvents.length > 0 ? (
        <CardGridEvent
          cardsData={technicalEvents}
          userRegisteredEventIds={userRegisteredEventIds}
          onCardClick={openModal}
        />
      ) : (
        <div className="no-events-message">No technical events available</div>
      )}

      <h2 className="center-heading">Non-Technical Events</h2>
      {nonTechnicalEvents.length > 0 ? (
        <CardGridEvent
          cardsData={nonTechnicalEvents}
          userRegisteredEventIds={userRegisteredEventIds}
          onCardClick={openModal}
        />
      ) : (
        <div className="no-events-message">No non-technical events available</div>
      )}

      {/* Render ModalEvent if a selected event is available */}
      {selectedEvent && (
        <ModalEvent
          isOpen={isModalOpen}
          onClose={closeModal}
          card={selectedEvent}
        />
      )}
    </>
  );
}
