const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(express.json());

// NIC Validation endpoint
app.post('/validate-nic', (req, res) => {
  // For demonstration, use a fixed path
  const filePath = 'path/to/uploaded/file.csv';

  const results = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Assuming NIC is in a column named 'nic'
      const nic = data.nic;
      // Validate NIC and extract details (mock logic)
      const birthday = '1990-01-01'; // Replace with actual logic
      const age = 30; // Replace with actual logic
      const gender = 'Male'; // Replace with actual logic
      results.push({ nic, birthday, age, gender });
    })
    .on('end', () => {
      res.json(results);
    });
});

app.listen(3002, () => {
  console.log('NIC validation service running on port 3002');
});
