import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Autorisation/Signup';
import SignIn from './components/Autorisation/SignIn';
import Dashboard from './components/Dashboard/Dashboard';
import EventForm from './components/Event Management/EventForm';
import EventDetails from './components/Event Management/EventDetails';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/signin" />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return !token ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-event"
          element={
            <PrivateRoute>
              <EventForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <PrivateRoute>
              <EventDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
