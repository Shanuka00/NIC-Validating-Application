import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:3001/auth'; // Update baseURL to include /api

Modal.setAppElement('#root'); // Ensure accessibility by specifying the root element

function Forgot() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    // Handle email submission and OTP generation
    const handleEmailSubmit = async () => {
        try {
            // Make an API call to send OTP to the user's email
            const response = await axios.post('/send-otp', { email });
            if (response.status === 200) {
                setEmailSubmitted(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to send OTP',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error sending OTP',
            });
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        try {
            // Make an API call to verify the OTP
            const response = await axios.post('/verify-otp', { email, otp });
            if (response.status === 200) {
                setIsOtpVerified(true);
                handleOpenModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid OTP',
                    text: 'The OTP you entered is incorrect.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error verifying OTP',
            });
        }
    };

    // Handle password change
    const handleChangePassword = async () => {
        try {
            // Make an API call to change the password
            const response = await axios.post('/change-password', { email, newPassword });
            if (response.status === 200) {
                handleCloseModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password changed successfully',
                }).then(() => {
                    navigate('/login'); // Navigate to login screen
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to change password',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error changing password',
            });
        }
    };

    // Open the password change modal
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Close the password change modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPassword(''); // Reset password field after closing modal
    };

    return (
        <div className="flex justify-center items-center h-screen bg-light-cyan-50 ml-auto mr-auto">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <div className="text-center mb-8">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4 text-cyan-600 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 6.00386V5C8 3.89543 7.10457 3 6 3C4.89543 3 4 3.89543 4 5V6.00386M21 16V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H12M3 16V13M4.5 9H7.5C7.96594 9 8.19891 9 8.38268 8.92388C8.62771 8.82239 8.82239 8.62771 8.92388 8.38268C9 8.19891 9 7.96594 9 7.5C9 7.03406 9 6.80109 8.92388 6.61732C8.82239 6.37229 8.62771 6.17761 8.38268 6.07612C8.19891 6 7.96594 6 7.5 6H4.5C4.03406 6 3.80109 6 3.61732 6.07612C3.37229 6.17761 3.17761 6.37229 3.07612 6.61732C3 6.80109 3 7.03406 3 7.5C3 7.96594 3 8.19891 3.07612 8.38268C3.17761 8.62771 3.37229 8.82239 3.61732 8.92388C3.80109 9 4.03406 9 4.5 9ZM22 16V16.8C22 17.9201 22 18.4802 21.782 18.908C21.5903 19.2843 21.2843 19.5903 20.908 19.782C20.4802 20 19.9201 20 18.8 20H5.2C4.0799 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V16H8.33726C8.58185 16 8.70414 16 8.81923 16.0276C8.92127 16.0521 9.01881 16.0925 9.10828 16.1474C9.2092 16.2092 9.29568 16.2957 9.46863 16.4686L9.53137 16.5314C9.70432 16.7043 9.7908 16.7908 9.89172 16.8526C9.98119 16.9075 10.0787 16.9479 10.1808 16.9724C10.2959 17 10.4182 17 10.6627 17H13.3373C13.5818 17 13.7041 17 13.8192 16.9724C13.9213 16.9479 14.0188 16.9075 14.1083 16.8526C14.2092 16.7908 14.2957 16.7043 14.4686 16.5314L14.5314 16.4686C14.7043 16.2957 14.7908 16.2092 14.8917 16.1474C14.9812 16.0925 15.0787 16.0521 15.1808 16.0276C15.2959 16 15.4182 16 15.6627 16H22Z"
                        />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-800">Forgot your password?</h2>
                    <p className="text-gray-600 mt-2">Enter your email and we'll help you reset your password.</p>
                </div>

                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Enter your email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleEmailSubmit}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        Continue
                    </button>

                    {emailSubmitted && !isOtpVerified && (
                        <>
                            <div className="mt-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                Verify OTP
                            </button>
                        </>
                    )}
                </form>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                    className="bg-white p-8 shadow-lg rounded-lg max-w-md mx-auto my-20 outline-none"
                    overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleChangePassword}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                        Confirm
                    </button>
                </Modal>
            </div>
        </div>
    );
}

export default Forgot;


