import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import 'tailwindcss/tailwind.css';

function Validator() {
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState(null); // State for validation results
  const [error, setError] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(true); // State to show "No files selected yet" message

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length !== 4) {
        setError('Please upload exactly 4 files.');
        return;
      }
      setFiles(acceptedFiles);
      setError(null);
      setShowNoDataMessage(false); // hide message and svg icon
    },
    accept: '.csv',
  });

  const handleValidate = async () => {
    if (files.length !== 4) {
      setError('Please upload exactly 4 files.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:3002/api/nic-validation/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValidationResults(response.data.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to validate NICs'); // Set error message if validation fails
    }
  };

  useEffect(() => {
    if (validationResults) {
      setShowNoDataMessage(false); // Hide message when results are available
    }
  }, [validationResults]);

  return (
    <div className="container mx-auto p-6 pt-28 px-8 flex-grow">

      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <div
          {...getRootProps()}
          className={`flex-1 border-2 border-dashed p-6 rounded-lg shadow-lg transition duration-300 ease-in-out ${
            isDragActive ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-lg font-semibold text-center">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop 4 CSV files here, or click to select files'}
          </p>
        </div>

        <button
          onClick={handleValidate}
          className="bg-cyan-600 text-white px-6 py-3 h-16 mt-1.5 rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 ease-in-out"
        >
          Validate
        </button>
      </div>

      <div className="mb-6">
        {files.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Selected Files:</h3>
            <ul className="list-disc pl-5">
              {Array.from(files).map((file, index) => (
                <li key={index} className="mb-2">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showNoDataMessage && !validationResults && (
        <div className="flex flex-col items-center justify-center min-h-[356px] opacity-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 17L21 21M21 17L17 21M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H13M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V14M9 17H13M9 13H15M9 9H10"
            />
          </svg>
          <p className="text-lg text-gray-500">No files selected yet</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {validationResults && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-bold mb-4">Validation Results:</h3>
          <ul className="list-disc pl-5">
            {validationResults.map((result, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">NIC:</span> {result.nic_number}, 
                <span className="font-semibold"> Birthday:</span> {result.birthday}, 
                <span className="font-semibold"> Age:</span> {result.age}, 
                <span className="font-semibold"> Gender:</span> {result.gender}, 
                <span className="font-semibold"> File:</span> {result.file_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Validator;
