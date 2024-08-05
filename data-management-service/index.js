const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());

// Set up Sequelize connection using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST, // host
    dialect: 'mysql',
  }
);

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

// Start the server and authenticate database connection
app.listen(3003, async () => {
  try {
    console.log('Data management service running on port 3003');
    await sequelize.authenticate();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
