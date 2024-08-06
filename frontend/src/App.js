import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Start from "./pages/start";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";

function App() {
  return (

    <HelmetProvider>
    <Router>
      <Routes>

        <Route path="/" element={
            <div className="flex min-h-screen bg-gray-200">
              <Start />
            </div>
          } />
        <Route path="/login" element={
            <div className="flex min-h-screen bg-gray-200">
              <Login />
            </div>
          } />
        <Route path="/signup" element={
            <div className="flex min-h-screen bg-gray-200">
              <Signup />
            </div>
          } />
        <Route path="/dashboard" element={
            <div className="flex min-h-screen bg-gray-200">
              <Dashboard />
            </div>
          } />

      </Routes>
      <Helmet>
          <title>NIC-Validating</title>
      </Helmet>
    </Router>
    </HelmetProvider>
  );
}

export default App;