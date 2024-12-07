import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import CardGridEvent from "./CardGridEvent";
import ModalEvent from "./ModalEvent"; // Modal to show event details
import "../components/css/events.css";

export default function Sports() {
  const [events, setEvents] = useState([]); // State to hold events
  const [loading, setLoading] = useState(true); // State to handle loading
  const [selectedEvent, setSelectedEvent] = useState(null); // Holds selected event details
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState([]); // User's registered event ids

  // Fetch events and clubs data when the component mounts
  useEffect(() => {
    const fetchEventsAndClubs = async () => {
      try {
        const eventsResponse = await fetch("http://localhost:8080/admin/getAllEvents");
        const eventsData = await eventsResponse.json();

        // Fetch club info for each event and add to the event
        const eventsWithClubs = await Promise.all(
          eventsData.map(async (event) => {
            const clubResponse = await fetch(`http://localhost:8080/admin/${event.clubId}`);
            const clubData = await clubResponse.json();
            return { ...event, club: clubData };
          })
        );

        setEvents(eventsWithClubs); // Store events with club data
        setLoading(false); // Set loading to false once the data is fetched
      } catch (error) {
        console.error("Error fetching events or clubs:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    // Fetch user's registered events
    const fetchUserRegisteredEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.email) {
        try {
          const response = await fetch(`http://localhost:8080/registrations/${user.email}`);
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
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Filter sports events based on the club's category
  const sportsEvents = events.filter((event) => event.club.category === "Sports");

  // Modal open handler
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

  // Modal close handler
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // If the events are still loading, show a loading message
  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <>
      <Banner title1="Sports" title2="Events" />

      <h2 className="center-heading">Sports Events</h2>
      {sportsEvents.length > 0 ? (
        <CardGridEvent
          cardsData={sportsEvents}
          userRegisteredEventIds={userRegisteredEventIds}
          onCardClick={openModal}
        />
      ) : (
        <div className="no-events-message">No sports events available</div>
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
