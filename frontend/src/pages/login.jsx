import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

axios.defaults.baseURL = 'http://localhost:3001/auth';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData);
      Swal.fire({
        title: 'Success!',
        text: 'Login successful.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        navigate('/dashboard'); // Redirect to dashboard
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || 'Login failed.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-light-blue-50 ml-auto mr-auto">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6 flex justify-between items-center">
            <Link to="/forgot-password" className="text-blue-500 hover:text-blue-700 text-sm font-medium ml-auto mr-auto">Forgot Password?</Link>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Login
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            <span className="mr-1">New to here?</span>
            <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-medium">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
