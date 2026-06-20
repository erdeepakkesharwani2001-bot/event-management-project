import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EventList() {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // UI state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/event/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAllEvents(response.data || []);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Derived list: filter -> sort -> paginate
  const { pagedEvents, totalPages } = useMemo(() => {
    const items = (allEvents || []).slice();

    // filtering
    const searchLower = search.trim().toLowerCase();
    let filtered = items.filter((e) => {
      if (venueFilter && (e.venue || '') !== venueFilter) return false;
      if (!searchLower) return true;
      const haystack = `${e.title || ''} ${e.description || ''} ${e.organizer || ''} ${e.venue || ''} ${e.phone || ''}`.toLowerCase();
      return haystack.includes(searchLower);
    });

    // sorting
    const order = sortOrder === 'asc' ? 1 : -1;
    filtered.sort((a, b) => {
      const aVal = (a[sortBy] ?? '').toString().toLowerCase();
      const bVal = (b[sortBy] ?? '').toString().toLowerCase();
      if (aVal < bVal) return -1 * order;
      if (aVal > bVal) return 1 * order;
      return 0;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    const start = (page - 1) * limit;
    const pagedEvents = filtered.slice(start, start + limit);

    return { pagedEvents, totalPages };
  }, [allEvents, page, limit, search, venueFilter, sortBy, sortOrder]);

  // Reset page if filtering reduces pages
  useEffect(() => {
    const filteredCount = (allEvents || []).filter((e) => {
      if (venueFilter && (e.venue || '') !== venueFilter) return false;
      const searchLower = search.trim().toLowerCase();
      if (!searchLower) return true;
      const haystack = `${e.title || ''} ${e.description || ''} ${e.organizer || ''} ${e.venue || ''} ${e.phone || ''}`.toLowerCase();
      return haystack.includes(searchLower);
    }).length;
    const newTotal = Math.max(1, Math.ceil(filteredCount / limit));
    if (page > newTotal) setPage(1);
  }, [allEvents, search, venueFilter, limit, page]);

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
      // remove locally for instant feedback
      setAllEvents((prev) => prev.filter((e) => (e._id || e.id) !== id));
    } catch (err) {
      console.error('Failed to delete event', err);
      setError('Failed to delete event');
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
      <div className="table-header-row" style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Existing Events</h3>
        <button className="btn-add" onClick={handleAddEvent}>Add Event</button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: 6 }}
          />
          <select value={venueFilter} onChange={(e) => { setVenueFilter(e.target.value); setPage(1); }}>
            <option value="">All Venues</option>
            {Array.from(new Set((allEvents || []).map((x) => x.venue).filter(Boolean))).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
            {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>

      {loading && <div style={{ padding: 16 }}>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th onClick={() => { setSortBy('title'); setSortOrder((o) => o === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
              Title {sortBy === 'title' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => { setSortBy('description'); setSortOrder((o) => o === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
              Description {sortBy === 'description' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => { setSortBy('date'); setSortOrder((o) => o === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
              Date {sortBy === 'date' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => { setSortBy('organizer'); setSortOrder((o) => o === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
              Organizer {sortBy === 'organizer' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Phone</th>
            <th onClick={() => { setSortBy('venue'); setSortOrder((o) => o === 'asc' ? 'desc' : 'asc'); }} style={{ cursor: 'pointer' }}>
              Venue {sortBy === 'venue' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedEvents.length === 0 && (
            <tr><td colSpan={7} style={{ padding: 16 }}>No events found.</td></tr>
          )}
          {pagedEvents.map((event, idx) => {
            const id = event._id || event.id || `${(event.title || 'event')}-${idx}`;
            return (
              <tr key={id}>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{formatDate(event.date)}</td>
                <td>{event.organizer}</td>
                <td>{event.phone}</td>
                <td>{event.venue}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-info" onClick={() => handleView(id)} title="View">👁️</button>
                  <button className="btn-danger" onClick={() => handleDelete(id)} title="Delete">🗑️</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>Next</button>
        <button onClick={() => { setSearch(''); setVenueFilter(''); setPage(1); }}>Clear Filters</button>
        <button onClick={fetchEvents}>Refresh</button>
      </div>
    </div>
  );
}

export default EventList;