const express = require('express');
const PDFDocument = require('pdfkit');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
app.use(express.json());

// PDF report generation
app.get('/report/pdf', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.text('NIC Validation Report');
  doc.end();
});

// CSV report generation
app.get('/report/csv', async (req, res) => {
  const csvWriter = createObjectCsvWriter({
    path: 'report.csv',
    header: [
      { id: 'nic', title: 'NIC' },
      { id: 'birthday', title: 'Birthday' },
      { id: 'age', title: 'Age' },
      { id: 'gender', title: 'Gender' },
    ],
  });

  // Mock data
  const records = [
    { nic: '123456789V', birthday: '1990-01-01', age: 30, gender: 'Male' },
  ];

  await csvWriter.writeRecords(records);
  res.download('report.csv');
});

app.listen(3004, () => {
  console.log('Reporting service running on port 3004');
});
