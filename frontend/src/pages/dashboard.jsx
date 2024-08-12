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

  // Fetch NIC stats for the last 7 days
  const fetchNicStats = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/last7days');
      const data = response.data;

      // Group data by date and gender
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

      setBarData(Object.values(groupedData)); // Set data for bar chart
    } catch (err) {
      console.error('Failed to fetch NIC stats:', err);
    }
  };

  // Fetch gender distribution data
  const fetchGenderDistribution = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/nic-validation/stats/gender-distribution');
      const data = response.data;

      // Format data for pie chart
      const formattedData = data.map(item => ({
        name: item.gender,
        value: item.count,
      }));

      setPieData(formattedData); // Set data for pie chart
    } catch (err) {
      console.error('Failed to fetch gender distribution:', err);
    }
  };

  useEffect(() => {
    fetchNicStats(); // Fetch bar chart data on mount
    fetchGenderDistribution(); // Fetch pie chart data on mount
  }, []);

  const COLORS = ['#D95890', '#106DB5']; // Define colors for pie chart

  return (

    <div className="container mx-auto p-6 pt-16">

      <div className="grid grid-cols-3 gap-7 mb-8 pt-12">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">NIC Count (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" className='text-sm'/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" stackId="a" fill="#106DB5" />
              <Bar dataKey="female" stackId="a" fill="#D95890" />
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
                fill="#7F7BC9"
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

      <div className="flex flex-col md:flex-row justify-center gap-40 mt-10">

        <button
          className="items-center w-4/12 h-32 bg-cyan-600 text-white p-5 rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 ease-in-out"
          onClick={() => window.location.href = '/validator'}
        >
          <svg className="w-10 h-10 mr-3 ml-auto mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9H14M18 12H14M12 15.5C11.7164 14.3589 10.481 13.5 9 13.5C7.519 13.5 6.28364 14.3589 6 15.5M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19ZM10 9.5C10 10.0523 9.55228 10.5 9 10.5C8.44772 10.5 8 10.0523 8 9.5C8 8.94772 8.44772 8.5 9 8.5C9.55228 8.5 10 8.94772 10 9.5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-lg font-medium mr-auto">Go to NIC Validator</span>
        </button>

        <button
          className="items-center w-4/12 h-32 bg-cyan-600 text-white p-5 rounded-lg shadow-lg hover:bg-cyan-700 transition duration-300 ease-in-out"
          onClick={() => window.location.href = '/management'}
        >
          <svg className="w-10 h-10 mr-3 ml-auto mr-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 15V15.8C17 16.9201 17 17.4802 16.782 17.908C16.5903 18.2843 16.2843 18.5903 15.908 18.782C15.4802 19 14.9201 19 13.8 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V12.2C3 11.0799 3 10.5198 3.21799 10.092C3.40973 9.71569 3.71569 9.40973 4.09202 9.21799C4.51984 9 5.0799 9 6.2 9H7M16 5H10.2C9.0799 5 8.51984 5 8.09202 5.21799C7.71569 5.40973 7.40973 5.71569 7.21799 6.09202C7 6.51984 7 7.0799 7 8.2V11.8C7 12.9201 7 13.4802 7.21799 13.908C7.40973 14.2843 7.71569 14.5903 8.09202 14.782C8.51984 15 9.0799 15 10.2 15H17.8C18.9201 15 19.4802 15 19.908 14.782C20.2843 14.5903 20.5903 14.2843 20.782 13.908C21 13.4802 21 12.9201 21 11.8V10M16 5L21 10M16 5V8.4C16 8.96005 16 9.24008 16.109 9.45399C16.2049 9.64215 16.3578 9.79513 16.546 9.89101C16.7599 10 17.0399 10 17.6 10H21" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-lg font-medium">Data Management and Reporting</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
