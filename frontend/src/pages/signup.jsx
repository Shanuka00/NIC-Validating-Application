import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.baseURL = 'http://localhost:3001/auth';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    retypePassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation for matching passwords
    if (formData.password !== formData.retypePassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords do not match.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.post('/register', formData);
      Swal.fire({
        title: 'Registration successful!',
        text: 'You can login now.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || 'Registration failed.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light-cyan-50 ml-auto mr-auto">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">Signup</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="retypePassword" className="block text-gray-700 text-sm font-medium mb-2">Retype Password</label>
            <input
              type="password"
              id="retypePassword"
              value={formData.retypePassword}
              onChange={handleChange}
              placeholder="Retype password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Signup
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            <span className="mr-1">Already have an account?</span>
            <Link to="/login" className="text-cyan-500 hover:text-cyan-700 font-medium">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
