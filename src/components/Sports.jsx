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
        const eventsResponse = await fetch("https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllEvents");
        const eventsData = await eventsResponse.json();

        // Fetch club info for each event and add to the event
        const eventsWithClubs = await Promise.all(
          eventsData.map(async (event) => {
            const clubResponse = await fetch(`https://jfsdactivityhubbackend-production.up.railway.app/admin/${event.clubId}`);
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
    return (
      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f0f0', // Optional for a better background
          }}
        >
          <h1 style={{ fontSize: '2rem', color: '#333', fontWeight: 'bold' }}>Loading Sports<span className="dots"></span></h1>
        </div>
        <style>
          {`
            .dots {
              display: inline-block;
              margin-left: 5px;
            }
            .dots::after {
              content: '...';
              display: inline-block;
              animation: dots 1.5s steps(3, end) infinite;
            }
            @keyframes dots {
              0% {
                content: '';
              }
              33% {
                content: '.';
              }
              66% {
                content: '..';
              }
              100% {
                content: '...';
              }
            }
          `}
        </style>
      </>
    );
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
