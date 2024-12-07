import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import CardGridEvent from "./CardGridEvent";
import "../components/css/events.css";

export default function Events() {
  const [events, setEvents] = useState([]); // State to hold events
  const [loading, setLoading] = useState(true); // State to handle loading

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

    fetchEventsAndClubs();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // If the events are still loading, show a loading message or spinner
  if (loading) {
    return <div>Loading events...</div>;
  }

  // Separate technical and non-technical events based on the club's category
  const sportsEvent = events.filter(event => event.club.category === "Sports");
 

  return (
    <>
      <Banner title1="Sports" title2="" />
      {/* Always display the heading for non-technical events */}
      
      {sportsEvent.length > 0 ? (
        <CardGridEvent cardsData={sportsEvent} />
      ) : (
        <div className="no-events-message">No Sports events available</div> // Show this if no non-technical events are present
      )}
    </>
  );
}
