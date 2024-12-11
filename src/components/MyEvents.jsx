import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyEventsPage = () => {
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState([]);
  const [eventsDetails, setEventsDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch User Registered Events
  const fetchUserRegisteredEvents = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      try {
        const response = await fetch(`https://jfsdactivityhubbackend-production.up.railway.app/registrations/${user.email}`);
        if (!response.ok) throw new Error("Failed to fetch user registered events");
        const data = await response.json();
        setUserRegisteredEventIds(data.map((event) => event.eventId));
      } catch (error) {
        setLoading(false);
        console.error("Error fetching user registered events:", error);
      }
    }
  };

  // Cancel Registration Function
  const cancelRegistration = async (email, eventId) => {
    try {
      const response = await fetch(
        `https://jfsdactivityhubbackend-production.up.railway.app/registrations/${email}/cancel/${eventId}`,
        { method: "POST" }
      );

      const message = await response.text();
      if (message === "Successfully canceled the registration.") {
        toast.success(message);
        setUserRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
        setEventsDetails((prev) => prev.filter((event) => event.id !== eventId));
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error canceling registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Fetch User Registered Events on component mount
  useEffect(() => {
    fetchUserRegisteredEvents();
  }, []);

  // Fetch Event Details when `userRegisteredEventIds` changes
  useEffect(() => {
    if (userRegisteredEventIds.length > 0) {
      const fetchEventDetails = async () => {
        const eventDetails = [];
        for (const eventId of userRegisteredEventIds) {
          try {
            const response = await fetch(`https://jfsdactivityhubbackend-production.up.railway.app/admin/getEvent/${eventId}`);
            if (response.ok) {
              const data = await response.json();
              eventDetails.push(data);
            } else {
              console.error(`Failed to fetch details for eventId ${eventId}`);
            }
          } catch (error) {
            console.error("Error fetching event details:", error);
          }
        }
        setEventsDetails(eventDetails);
        setLoading(false);
      };

      fetchEventDetails();
    } else {
      setLoading(false); // Stop loading if no registered events
    }
  }, [userRegisteredEventIds]);

  // Render loading state or events
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
          <h1 style={{ fontSize: '2rem', color: '#333', fontWeight: 'bold' }}>Loading Your Registered Events<span className="dots"></span></h1>
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
    <ToastContainer />
    <div style={{ marginTop: '100px', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontStyle:'inherit'}}>My Registered Events</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {eventsDetails.length > 0 ? (
          eventsDetails.map((event) => (
            <div
              key={event.id}
              style={{
                width: '300px',
                height: '400px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                margin: '16px',
                padding: '16px',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${event.eventImage}`}
                  alt={event.eventName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{ flexGrow: 1 }}>
                <h3>{event.eventName}</h3>
                <p>{event.eventDescription}</p>
                <p>
                  <strong>Date:</strong> {event.eventDate}
                </p>
                <p>
                  <strong>Time:</strong> {event.eventTime}
                </p>
                <p>
                  <strong>Venue:</strong> {event.eventVenue}
                </p>
                <p>
                  <strong>Points:</strong> {event.points}
                </p>
              </div>
              <button
                onClick={() => cancelRegistration(JSON.parse(localStorage.getItem("user")).email, event.id)}
                style={{
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  width: '100%',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Cancel Registration
              </button>
            </div>
          ))
        ) : (
          <p style={{ marginBottom: '500px' }}>No events registered yet.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default MyEventsPage;
