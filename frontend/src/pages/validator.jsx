import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function Validator() {
  const [files, setFiles] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleValidate = async () => {
    if (files.length !== 4) {
      setError('Please upload exactly 4 files.');
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">NIC Validator</h2>
      <input type="file" multiple onChange={handleFileChange} className="mb-4" />
      <button onClick={handleValidate} className="bg-blue-500 text-white px-4 py-2 rounded">
        Validate
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {validationResults && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Validation Results:</h3>
          <ul className="list-disc pl-5">
            {validationResults.map((result, index) => (
              <li key={index} className="mb-2">
                NIC: {result.nic_number}, Birthday: {result.birthday}, Age: {result.age}, Gender: {result.gender}, File: {result.file_name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Validator;
