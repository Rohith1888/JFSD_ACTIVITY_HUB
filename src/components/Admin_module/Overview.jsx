import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/Admin_Module/Overview.css';
import studentIcon from '../../Assets/images/student.png';
import eventIcon from '../../Assets/images/event.png';
import clubIcon from '../../Assets/images/post.png';

const Overview = () => {
  const [eventData] = useState([
    { date: '2023-10-01', count: 20 },
    { date: '2023-10-15', count: 35 },
    { date: '2023-11-01', count: 50 },
    { date: '2023-11-15', count: 30 },
  ]);

  const [dashboardData] = useState({
    totalStudents: 500,
    studentsRegisteredInEvents: 200,
    totalEvents: 30,
    totalParticipation: 600,
    totalClubs: 15,
  });

  useEffect(() => {
    // Fetch or update data here if needed
  }, []);

  return (
    <div className="overview-container_admin">
    
      <div className="card-container_admin">
        <div className="card_admin">
          <img src={studentIcon} alt="Students" className="card-icon_admin" />
          <div className="card-content_admin">
            <h2>Students</h2>
            <p>Total: {dashboardData.totalStudents}</p>
            <p>Registered in Events: {dashboardData.studentsRegisteredInEvents}</p>
          </div>
        </div>
        <div className="card_admin">
          <img src={eventIcon} alt="Events" className="card-icon_admin" />
          <div className="card-content_admin">
            <h2>Events</h2>
            <p>Total: {dashboardData.totalEvents}</p>
            <p>Total Participation: {dashboardData.totalParticipation}</p>
          </div>
        </div>
        <div className="card_admin">
          <img src={clubIcon} alt="Clubs" className="card-icon_admin" />
          <div className="card-content_admin">
            <h2>Clubs</h2>
            <p>Total Clubs: {dashboardData.totalClubs}</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Event Participation Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
