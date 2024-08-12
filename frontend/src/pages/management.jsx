import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import 'tailwindcss/tailwind.css';

function Management() {
  const [nicData, setNicData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    gender: '',
    file_name: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation', {
        params: filters,
      });
      setNicData(response.data);
    } catch (err) {
      console.error('Failed to fetch NIC data:', err);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const generateCSV = () => {
    const csv = Papa.unparse(nicData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nic_data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['NIC', 'Birthday', 'Age', 'Gender', 'File Name', 'Created At']],
      body: nicData.map((nic) => [
        nic.nic_number,
        nic.birthday,
        nic.age,
        nic.gender,
        nic.file_name,
        new Date(nic.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save('nic_data.pdf');
  };

  const handleReport = async () => {
    const { value: format } = await Swal.fire({
      title: 'Select Report Format',
      input: 'radio',
      inputOptions: {
        csv: 'CSV',
        pdf: 'PDF',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose a format!';
        }
      },
      confirmButtonText: 'Generate',
    });

    if (format === 'csv') {
      generateCSV();
    } else if (format === 'pdf') {
      generatePDF();
    }

    Swal.fire({
      title: 'Report Generated!',
      text: `Your ${format.toUpperCase()} report will download automatically.`,
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  return (
    <div className="container mx-auto p-4 pt-28 px-8">
      <div className="flex w-full">
        <div className="mb-4 w-10/12">
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

        <div>
          <button
            onClick={handleReport}
            className="bg-cyan-600 text-white px-6 py-3 -mt-0.5 ml-20 rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 ease-in-out"
          >
            Generate report
          </button>
        </div>
      </div>

      <table className="mt-4 table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-200 p-2 bg-slate-300">NIC</th>
            <th className="border border-gray-200 p-2 bg-slate-300">Birthday</th>
            <th className="border border-gray-200 p-2 bg-slate-300">Age</th>
            <th className="border border-gray-200 p-2 bg-slate-300">Gender</th>
            <th className="border border-gray-200 p-2 bg-slate-300">File Name</th>
            <th className="border border-gray-200 p-2 bg-slate-300">Created At</th>
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
              <td className="border border-gray-300 p-2">
                {new Date(nic.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Management;
