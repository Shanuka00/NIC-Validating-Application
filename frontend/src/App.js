import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Start from "./pages/start";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Validator from "./pages/validator";
import Management from "./pages/management";
import Header from "./pages/header";
import Footer from "./pages/footer";
import ProtectedRoute from './pages/protectedRoute';

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
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-200">
                <Header title="Dashboard" />
                <Dashboard />
                <Footer />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/validator" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-200">
                <Header title="NIC Validator" />
                <Validator />
                <Footer />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/management" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-200">
                <Header title="Data Management and Reporting" />
                <Management />
                <Footer />
              </div>
            </ProtectedRoute>
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
