import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import 'tailwindcss/tailwind.css';

function Validator() {
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [error, setError] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length !== 4) {
        setError('Please upload exactly 4 files.');
        return;
      }
      setFiles(acceptedFiles);
      setError(null);
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
      setError(null);
    } catch (err) {
      setError('Failed to validate NICs');
    }
  };

  return (
    <div className="container mx-auto p-6 pt-28 h-screen px-8 mb-10 pb-10">

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

      {error && <p className="text-red-500 text-center">{error}</p>}

      {validationResults && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-6 mb-10">
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
