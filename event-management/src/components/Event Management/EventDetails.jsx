import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Dashboard/Navbar';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/event/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEvent(response.data);
      } catch (err) {
        console.error('Failed to fetch event', err);
      }
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!event) return <div><Navbar /><div style={{ padding: 24 }}>Loading...</div></div>;

  return (
    <div>
      <Navbar />
      <div className="event-details-container">
        <h2>{event.title}</h2>
        <p>Description: {event.description}</p>
        <p>Date: {formatDate(event.date)}</p>
        <p>Organizer: {event.organizer}</p>
        <p>Phone: {event.phone}</p>
        <p>Venue: {event.venue}</p>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          Back to Events
        </button>
      </div>
    </div>
  );
}

export default EventDetails;
