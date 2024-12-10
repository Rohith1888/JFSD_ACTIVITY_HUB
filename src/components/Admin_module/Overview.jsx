import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to install axios
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import necessary recharts components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../css/Admin_Module/Overview.css';
import studentIcon from '../../Assets/images/student.png';
import eventIcon from '../../Assets/images/event.png';
import clubIcon from '../../Assets/images/post.png';

const Overview = () => {
  // State variables to store the fetched data
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    studentsRegisteredInEvents: 0,
    totalEvents: 0,
    totalParticipation: 0,
    totalClubs: 0,
  });
  const [loading, setLoading] = useState(true); // State to handle loading

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Function to fetch data from the APIs
  const fetchData = async () => {
    try {
      // Fetching total students
      const studentsResponse = await axios.get('https://jfsdactivityhubbackend-production.up.railway.app/student/all');
      const totalStudents = studentsResponse.data.length;

      // Fetching total clubs
      const clubsResponse = await axios.get('https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllClubs');
      const totalClubs = clubsResponse.data.length;

      // Fetching total events
      const eventsResponse = await axios.get('https://jfsdactivityhubbackend-production.up.railway.app/admin/getAllEvents');
      const totalEvents = eventsResponse.data.length;

      // Update the state with the fetched data
      setDashboardData((prevData) => ({
        ...prevData,
        totalStudents,
        totalClubs,
        totalEvents,
      }));
      setLoading(false); // Set loading to false once the data
    } catch (error) {
      setLoading(false); // Set loading to false even if there's an error
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  // Data for the PieChart
  const pieChartData = [
    { name: 'Students', value: dashboardData.totalStudents },
    { name: 'Events', value: dashboardData.totalEvents },
    { name: 'Clubs', value: dashboardData.totalClubs },
  ];

  // Define colors for each slice of the pie
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  // Handler functions for navigating to the respective pages
  const handleNavigateToStudents = () => {
    navigate('/admin/all');
  };

  const handleNavigateToClubs = () => {
    navigate('/admin/all-clubs');
  };

  const handleNavigateToEvents = () => {
    navigate('/admin/all-events');
  };
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
          <h1 style={{ fontSize: '2rem', color: '#333', fontWeight: 'bold' }}>Loading Dashboard<span className="dots"></span></h1>
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
    <div className="overview-container_admin">
      <div className="card-container_admin">
        <div className="card_admin" onClick={handleNavigateToStudents}>
          <img src={studentIcon} alt="Students" className="card-icon_admin" />
          <div className="card-content_admin">
            <h2>Students</h2>
            <p>Total: {dashboardData.totalStudents}</p>
          </div>
        </div>
        <div className="card_admin" onClick={handleNavigateToEvents}>
          <img src={eventIcon} alt="Events" className="card-icon_admin" />
          <div className="card-content_admin">
            <h2>Events</h2>
            <p>Total: {dashboardData.totalEvents}</p>
          </div>
        </div>
        <div className="card_admin" onClick={handleNavigateToClubs}>
          <img src={clubIcon} alt="Clubs" className="card-icon_admin" />
          <div className="card-content_admin">
            <h2>Clubs</h2>
            <p>Total Clubs: {dashboardData.totalClubs}</p>
          </div>
        </div>
      </div>

      {/* Pie Chart to represent the data */}
      <div className="chart-container">
        <h2>Distribution of Students, Events, and Clubs</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
