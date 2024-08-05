const express = require('express');
const app = express();
app.use(express.json());

// NIC Validation endpoint
app.post('/validate-nic', (req, res) => {
  // Dummy data array
  const dummyData = [
    { nic: '123456789V' },
    { nic: '987654321X' },
    { nic: '123123123V' },
    { nic: '456456456X' }
  ];

  // Process dummy data
  const results = dummyData.map(data => {
    // Assuming NIC is in a column named 'nic'
    const nic = data.nic;
    // Validate NIC and extract details (mock logic)
    const birthday = '1990-01-01'; // Replace with actual logic
    const age = 30; // Replace with actual logic
    const gender = 'Male'; // Replace with actual logic
    return { nic, birthday, age, gender };
  });

  // Send the response
  res.json(results);
});

app.listen(3002, () => {
  console.log('NIC validation service running on port 3002');
});
