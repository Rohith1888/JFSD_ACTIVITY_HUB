import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css';

const MyEventsPage = () => {
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState([]);
  const [eventsDetails, setEventsDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch User Registered Events
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

  // Fetch Event Details Using Event ID
  const fetchEventDetails = async () => {
    const eventDetails = [];
    for (const eventId of userRegisteredEventIds) {
      try {
        const response = await fetch(`http://localhost:8080/admin/getEvent/${eventId}`);
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

  // Cancel Registration Function
  const cancelRegistration = async (email, eventId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/registrations/${email}/cancel/${eventId}`,
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

  // Fetch User Registered Events and Event Details on component mount
  useEffect(() => {
    fetchUserRegisteredEvents();
  }, []);

  useEffect(() => {
    if (userRegisteredEventIds.length > 0) {
      fetchEventDetails();
    }
  }, [userRegisteredEventIds]);

  // Render loading state or events
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginTop: '100px', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My Registered Events</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {eventsDetails.length > 0 ? (
          eventsDetails.map((event) => (
            <div key={event.id} style={{
              width: '300px',
              height: '400px',  // Set a fixed height to ensure uniform card size
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              margin: '16px',
              padding: '16px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',  // Align content vertically
              justifyContent: 'space-between',  // Push content to top and bottom
            }}>
              <div style={{
                width: '100%',
                height: '150px',  // Set a fixed height for the image container
                overflow: 'hidden',  // Prevent overflow of image
                borderRadius: '8px',
                marginBottom: '16px',
              }}>
                <img
                  src={`data:image/jpeg;base64,${event.eventImage}`}
                  alt={event.eventName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',  // Ensure image covers the container without distortion
                  }}
                />
              </div>
              <div style={{ flexGrow: 1 }}>  {/* Allow content to grow to fill space */}
                <h3>{event.eventName}</h3>
                <p>{event.eventDescription}</p>
                <p><strong>Date:</strong> {event.eventDate}</p>
                <p><strong>Time:</strong> {event.eventTime}</p>
                <p><strong>Venue:</strong> {event.eventVenue}</p>
                <p><strong>Points:</strong> {event.points}</p>
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
          <p style={{marginBottom:'500px'}}>No events registered yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
