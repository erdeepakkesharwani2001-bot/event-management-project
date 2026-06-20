import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Dashboard/Navbar';

function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [phone, setPhone] = useState('');
  const [venue, setVenue] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    // Validate title: no special characters
    const titleRegex = /^[a-zA-Z0-9\s]+$/;
    if (!titleRegex.test(title)) {
      setError('Title must not contain special characters');
      return;
    }

    // Validate phone: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    // Validate venue: at least 3 characters
    if (venue.length < 3) {
      setError('Venue must have at least 3 characters');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/event/events',
        {
          title,
          description,
          date,
          organizer,
          phone,
          venue,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add event');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Navbar />
      <div className="add-event-container">
        <h2>Add Event</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            placeholder="dd-MM-yyyy"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Organizer</label>
          <input
            type="text"
            placeholder="Enter event organizer"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="Enter phone number (10 digits)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Venue</label>
          <input
            type="text"
            placeholder="Enter event venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>
        <div className="btn-row">
          <button className="btn-primary" style={{ marginTop: 0 }} onClick={handleSubmit}>
            Add Event
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventForm;
