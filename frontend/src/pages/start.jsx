import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import startimg from '../images/start_nic.gif';

function Start() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 4500); // Waiting 4500 milliseconds

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center ml-auto mr-auto h-screen w-screen">
      <img src={startimg} alt="Starting GIF" className="max-w-full max-h-full" />
    </div>
  );
}

export default Start;
