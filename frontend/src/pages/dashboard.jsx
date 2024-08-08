import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import 'tailwindcss/tailwind.css';

function Dashboard() {
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchNicStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/last7days');
      const data = response.data;

      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = { date: item.date, male: 0, female: 0 };
        }
        if (item.gender === 'Male') {
          acc[item.date].male += item.count;
        } else if (item.gender === 'Female') {
          acc[item.date].female += item.count;
        }
        return acc;
      }, {});

      setBarData(Object.values(groupedData));
    } catch (err) {
      console.error('Failed to fetch NIC stats:', err);
    }
  };

  const fetchGenderDistribution = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/gender-distribution');
      const data = response.data;

      const formattedData = data.map(item => ({
        name: item.gender,
        value: item.count,
      }));

      setPieData(formattedData);
    } catch (err) {
      console.error('Failed to fetch gender distribution:', err);
    }
  };

  useEffect(() => {
    fetchNicStats();
    fetchGenderDistribution();
  }, []);

  const COLORS = ['#FF69B4', '#0088FE'];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>

      <div className="grid grid-cols-3 gap-7 mb-8">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">NIC Count (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" className='text-sm'/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" stackId="a" fill="#0088FE" />
              <Bar dataKey="female" stackId="a" fill="#FF69B4" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-1 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-8">
        <button
          className="flex items-center bg-blue-500 text-white p-5 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={() => window.location.href = '/validator'}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v12a4 4 0 004 4h8a4 4 0 004-4V3m-1 8H6m0 0V5a2 2 0 012-2h8a2 2 0 012 2v6z"></path>
          </svg>
          <span className="text-lg font-medium">NIC Validator</span>
        </button>
        <button
          className="flex items-center bg-blue-500 text-white p-5 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out"
          onClick={() => window.location.href = '/management'}
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v12a4 4 0 004 4h8a4 4 0 004-4V3m-1 8H6m0 0V5a2 2 0 012-2h8a2 2 0 012 2v6z"></path>
          </svg>
          <span className="text-lg font-medium">Manage Data</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
