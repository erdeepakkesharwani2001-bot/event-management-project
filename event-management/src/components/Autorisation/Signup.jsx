import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Alert = ({ message }) => {
  if (!message) return null;
  return <div className="alert alert-danger">{message}</div>;
};

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/user/signup', {
        username,
        password,
        email,
      });
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <Alert message={error} />
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>
      <button className="btn-primary" onClick={handleSubmit}>
        Sign Up
      </button>
      <p className="text-center">
        Already have an account? <Link to="/signin">Return to Sign In</Link>
      </p>
    </div>
  );
}

export default Signup;
