import React, { useEffect, useState } from "react";

export default function Organizer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendancePopup, setAttendancePopup] = useState(false); // State to toggle popup visibility
  const [students, setStudents] = useState([]); // List of students for attendance
  const [selectedStudents, setSelectedStudents] = useState([]); // Track selected students for attendance
  const [unselectedStudents, setUnselectedStudents] = useState([]); // Track unselected students
  const [currentEvent, setCurrentEvent] = useState(null); // Track the current event being processed

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.email) {
        console.error("User email not found in local storage.");
        return;
      }

      const email = user.email;
      const url = `http://localhost:8080/student/${email}/organizingEvents`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to handle marking attendance
  const markAttendance = async (eventId) => {
    console.log(`Marking attendance for event ID: ${eventId}`);

    // Find the event from the events list
    const event = events.find((event) => event.id === eventId);
    setCurrentEvent(event);

    // Fetch the list of registered students for the event
    try {
      const response = await fetch(`http://localhost:8080/registrations/events/${eventId}/students`);
      const studentData = await response.json();

      console.log("Students registered for this event:", studentData);

      if (studentData.length === 0) {
        alert("No students registered for this event.");
      } else {
        setStudents(studentData); // Set the student data for the popup
        setAttendancePopup(true); // Show the popup
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (studentEmail, isChecked) => {
    if (isChecked) {
      setSelectedStudents((prevSelected) => [...prevSelected, studentEmail]);
      setUnselectedStudents((prevUnselected) => prevUnselected.filter((email) => email !== studentEmail));
    } else {
      setSelectedStudents((prevSelected) => prevSelected.filter((email) => email !== studentEmail));
      setUnselectedStudents((prevUnselected) => [...prevUnselected, studentEmail]);
    }
  };

  // Function to save attendance
  const saveAttendance = async () => {
    if (!currentEvent) return;

    console.log("Saving attendance for the following students:", selectedStudents);
    console.log("Students not attending:", unselectedStudents);

    // Prepare the data to send (both checked and unchecked students)
    const data = {
      eventId: currentEvent.id,
      attendedEmails: selectedStudents,
      nonAttendedEmails: unselectedStudents,  // Changed key to 'nonAttendedEmails' as per your backend
    };

    try {
      const response = await fetch(`http://localhost:8080/student/${currentEvent.id}/markAttendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Attendance marked successfully!");
        setAttendancePopup(false); // Close the popup after saving
      } else {
        alert("Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance.");
    }
  };

  // Close popup
  const closePopup = () => {
    setAttendancePopup(false);
  };

  if (loading) {
    return <h1 style={{ marginTop: "100px" }}>Loading events...</h1>;
  }

  return (
    <div style={{ marginTop: "100px", padding: "20px", marginBottom: "150px" }}>
      <h1>Organizer Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        events.map((currentEvent) => (
          <div
            key={currentEvent.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{currentEvent.eventName}</h3>
            <p>
              <strong>Description:</strong> {currentEvent.eventDescription}
            </p>
            <p>
              <strong>Date:</strong> {currentEvent.eventDate}
            </p>
            <p>
              <strong>Time:</strong> {currentEvent.eventTime}
            </p>
            <p>
              <strong>Venue:</strong> {currentEvent.eventVenue}
            </p>
            <p>
              <strong>Points:</strong> {currentEvent.points}
            </p>
            <p>
              <strong>Penalty:</strong> {currentEvent.penalty}
            </p>
            <button
              onClick={() => markAttendance(currentEvent.id)}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Mark Attendance
            </button>
          </div>
        ))
      )}

      {/* Attendance Popup */}
      {attendancePopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // Ensure the popup appears above other content
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "90%", // Set the width to 90% of the screen width
              height: "90%", // Set the height to 90% of the screen height
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", flex: 1, overflowY: "auto" }}>
              <button
                onClick={closePopup}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "10px",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <h3>Mark Attendance</h3>
              <div
                style={{
                  maxHeight: "calc(100% - 100px)", // Increase the scrollable area size
                  paddingRight: "10px",
                }}
              >
                {students.length === 0 ? (
                  <p>No students found for this event.</p>
                ) : (
                  students.map((student) => (
                    <div
                      key={student.studentEmail}
                      style={{
                        marginBottom: "15px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={student.studentEmail}
                        onChange={(e) => handleCheckboxChange(student.studentEmail, e.target.checked)} // Use student.studentEmail
                        style={{ marginRight: "10px" }}
                      />
                      <label htmlFor={student.studentEmail} style={{ fontWeight: "bold" }}>
                        {student.fullName} ({student.idNumber})
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div style={{ marginTop: "20px", alignSelf: "flex-end" }}>
              <button
                onClick={saveAttendance}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "15px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
