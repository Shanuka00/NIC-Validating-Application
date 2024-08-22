import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import ReactPaginate from 'react-paginate';
import 'tailwindcss/tailwind.css';
import '../styles/pagination.css';

function Validator() {
  const [files, setFiles] = useState([]);
  const [validResults, setValidResults] = useState([]);
  const [invalidResults, setInvalidResults] = useState([]);
  const [error, setError] = useState(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 10;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length !== 4) {
        setError('Please upload exactly 4 files.');
        return;
      }
      setFiles(acceptedFiles);
      setError(null);
      setShowNoDataMessage(false);
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
      const response = await axios.post('http://localhost:3003/api/nic-validation/validate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setValidResults(response.data.validData);
      setInvalidResults(response.data.invalidData);
      setError(null);
    } catch (err) {
      setError('Failed to validate NICs');
    }
  };

  useEffect(() => {
    if (validResults.length > 0 || invalidResults.length > 0) {
      setShowNoDataMessage(false);
    }
  }, [validResults, invalidResults]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Slice the results to show only the current page
  const paginatedValidResults = validResults.slice(currentPage * resultsPerPage, (currentPage + 1) * resultsPerPage);
  const paginatedInvalidResults = invalidResults.slice(currentPage * resultsPerPage, (currentPage + 1) * resultsPerPage);

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

      {showNoDataMessage && !validResults.length && !invalidResults.length && (
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

      {validResults.length > 0 && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-bold mb-4 text-blue-800">Valid NICs</h3>
          <table className="min-w-full border-separate border-spacing-2">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-3 border-b-2 border-blue-200 font-semibold">NIC</th>
                <th className="p-3 border-b-2 border-blue-200 font-semibold">Birthday</th>
                <th className="p-3 border-b-2 border-blue-200 font-semibold">Age</th>
                <th className="p-3 border-b-2 border-blue-200 font-semibold">Gender</th>
                <th className="p-3 border-b-2 border-blue-200 font-semibold">File</th>
              </tr>
            </thead>
            <tbody>
              {paginatedValidResults.map((result, index) => (
                <tr key={index} className="hover:bg-blue-100 transition-colors">
                  <td className="p-3 border-b border-blue-200">{result.nic_number}</td>
                  <td className="p-3 border-b border-blue-200">{result.birthday}</td>
                  <td className="p-3 border-b border-blue-200">{result.age}</td>
                  <td className="p-3 border-b border-blue-200">{result.gender}</td>
                  <td className="p-3 border-b border-blue-200">{result.file_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
          previousLabel={<span className="text-cyan-600">Previous</span>}
          nextLabel={<span className="text-cyan-600">Next</span>}
          breakLabel={<span className="text-cyan-600">...</span>}
          pageCount={Math.ceil(validResults.length / resultsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center my-4"
          pageClassName="mx-1"
          pageLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          previousClassName="mx-1"
          previousLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          nextClassName="mx-1"
          nextLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          breakClassName="mx-1"
          breakLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          activeClassName="text-white border-cyan-600"
        />
        </div>
      )}

      {invalidResults.length > 0 && (
        <div className="bg-red-50 p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-bold mb-4 text-red-800">Invalid NICs</h3>
          <table className="min-w-full border-separate border-spacing-2">
            <thead>
              <tr className="bg-red-100 text-left">
                <th className="p-3 border-b-2 border-red-200 font-semibold">NIC</th>
                <th className="p-3 border-b-2 border-red-200 font-semibold">File</th>
                <th className="p-3 border-b-2 border-red-200 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvalidResults.map((result, index) => (
                <tr key={index} className="hover:bg-red-100 transition-colors">
                  <td className="p-3 border-b border-red-200">{result.nic_number}</td>
                  <td className="p-3 border-b border-red-200">{result.file_name}</td>
                  <td className="p-3 border-b border-red-200">{result.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
          previousLabel={<span className="text-cyan-600">Previous</span>}
          nextLabel={<span className="text-cyan-600">Next</span>}
          breakLabel={<span className="text-cyan-600">...</span>}
          pageCount={Math.ceil(validResults.length / resultsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="flex justify-center my-4"
          pageClassName="mx-1"
          pageLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          previousClassName="mx-1"
          previousLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          nextClassName="mx-1"
          nextLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          breakClassName="mx-1"
          breakLinkClassName="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
          activeClassName="text-white border-cyan-600"
        />
        </div>
      )}
    </div>
  );
}

export default Validator;
