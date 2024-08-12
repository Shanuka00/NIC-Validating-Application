import React from 'react';
import { Link as RLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import visionLogo from '../images/start_nic.gif';

const Header = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from the application!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {

        // Remove the token from localStorage
        localStorage.removeItem('token');
        
        // Redirect to the login page
        navigate('/login');
        
      }
    });
  };

  return (
    <div className="w-screen h-20 z-10 bg-zinc-200 fixed drop-shadow-lg">
      <div className="px-2 flex justify-between items-center w-full h-full">
        <div className="flex items-center">
          <div className="ml-0 pl-0">
          <RLink to="/dashboard" className="ml-0 pl-0">
            <img
              src={visionLogo}
              width="90"
              height="90"
              style={{ opacity: 0.9 }}
              className="inline-block align-top"
              alt="Vision Logo"
            />
          </RLink>
          </div>
          <div>
            <h2 className="text-sm pl-1 text-gray-600 font-semibold sm:text-lg">{title}</h2>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center px-7 py-2 mr-10 rounded shadow-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
