import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

function Management() {
  const [nicData, setNicData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    gender: '',
    file_name: ''
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation', {
        params: filters,
      });
      setNicData(response.data);
    } catch (err) {
      console.error('Failed to fetch NIC data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">NIC Management</h2>

      <div className="mb-4">
        <label className="mr-4">Date:</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="mr-4 p-2 border rounded"
        />

        <label className="mr-4">Gender:</label>
        <select
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
          className="mr-4 p-2 border rounded"
        >
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label className="mr-4">File Name:</label>
        <input
          type="text"
          name="file_name"
          value={filters.file_name}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">NIC</th>
            <th className="border border-gray-300 p-2">Birthday</th>
            <th className="border border-gray-300 p-2">Age</th>
            <th className="border border-gray-300 p-2">Gender</th>
            <th className="border border-gray-300 p-2">File Name</th>
            <th className="border border-gray-300 p-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {nicData.map((nic, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{nic.nic_number}</td>
              <td className="border border-gray-300 p-2">{nic.birthday}</td>
              <td className="border border-gray-300 p-2">{nic.age}</td>
              <td className="border border-gray-300 p-2">{nic.gender}</td>
              <td className="border border-gray-300 p-2">{nic.file_name}</td>
              <td className="border border-gray-300 p-2">{new Date(nic.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Management;
