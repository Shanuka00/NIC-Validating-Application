import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/forgotpass.css';

axios.defaults.baseURL = 'http://localhost:3001/auth'; // Default base URL for axios

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
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-button'
        }
      }).then(() => {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        navigate('/dashboard');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.error || 'Login failed.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'custom-button'
        }
      });
    }
  };

  // forgot password alert I have used previously
  // const forgotPass = () => {
  //   Swal.fire({
  //     title: "I couldn't add the forgotten password option in time!",
  //     text: "Sorry about that 🥲",
  //     showClass: {
  //       popup: `
  //         animate__animated
  //         animate__fadeInUp
  //         animate__faster
  //       `
  //     },
  //     hideClass: {
  //       popup: `
  //         animate__animated
  //         animate__fadeOutUp
  //         animate__faster
  //       `
  //     },
  //     customClass: {
  //       confirmButton: 'custom-button'
  //     }
  //   });    
  // };

  return (
    <div className="flex justify-center items-center h-screen bg-light-cyan-50 ml-auto mr-auto">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
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

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="mb-6 flex justify-between items-center">
            {/* <label onClick={forgotPass} className="text-cyan-500 hover:text-cyan-700 text-sm font-medium ml-auto mr-auto">Forgot Password?</label> */}
            <Link to="/forgotpass" className="text-cyan-500 hover:text-cyan-700 text-sm font-medium ml-auto mr-auto">Forgot Password?</Link>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Login
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            <span className="mr-1">New to here?</span>
            <Link to="/signup" className="text-cyan-500 hover:text-cyan-700 font-medium">Signup</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
