import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Alert = ({ message }) => {
  if (!message) return null;
  return <div className="alert alert-danger">{message}</div>;
};

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/user/signin', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign in failed');
    }
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
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
        Sign In
      </button>
      <p className="text-center">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;
