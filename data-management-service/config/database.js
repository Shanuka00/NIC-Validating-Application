const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// Set up Sequelize connection
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define NIC model
const NIC = sequelize.define('NIC', {
  nic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthday: DataTypes.DATE,
  age: DataTypes.INTEGER,
  gender: DataTypes.STRING,
});

// Endpoint to save NIC data
app.post('/save-nic', async (req, res) => {
  const { nic, birthday, age, gender } = req.body;
  try {
    await NIC.create({ nic, birthday, age, gender });
    res.json({ message: 'NIC data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save NIC data' });
  }
});

app.listen(3003, () => {
  console.log('Data management service running on port 3003');
});
