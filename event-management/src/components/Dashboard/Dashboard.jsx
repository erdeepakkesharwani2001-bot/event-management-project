import React from 'react';
import Navbar from './Navbar';
import EventList from '../Event Management/EventList';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <h2>Welcome, {user.username}!</h2>
        <EventList />
      </div>
    </div>
  );
}

export default Dashboard;
