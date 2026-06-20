import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/event/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      console.error('No id provided for delete', id);
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/event/events/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  };

  const handleView = (id) => {
    if (!id) {
      console.error('No id provided for view', id);
      return;
    }
    navigate(`/events/${id}`);
  };

  const handleAddEvent = () => {
    navigate('/add-event');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <div className="table-header-row">
        <h3 className="section-title">Existing Events</h3>
        <button className="btn-add" onClick={handleAddEvent}>
          Add Event
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Organizer</th>
            <th>Phone</th>
            <th>Venue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const id = event._id || event.id;
            return (
              <tr key={id || Math.random()}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{formatDate(event.date)}</td>
                <td>{event.organizer}</td>
                <td>{event.phone}</td>
                <td>{event.venue}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-info"
                    onClick={() => handleView(id)}
                    title="View"
                  >
                    👁️
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EventList;