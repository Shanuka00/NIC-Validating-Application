const csv = require('csv-parser');
const stream = require('stream');
const { getNicDetails } = require('../utils/nicUtils.js');
const db = require('../config/db.config.js');
const { Op } = require('sequelize');

const validateNics = async (req, res) => {
  const files = req.files;
  const results = [];

  if (files.length !== 4) {
    return res.status(400).json({ error: 'Please upload exactly 4 files.' });
  }

  try {
    for (const file of files) {
      const nicNumbers = await parseCsv(file.buffer);
      const fileName = file.originalname;
      for (const nic of nicNumbers) {
        const details = getNicDetails(nic);
        if (details) {
          results.push({ ...details, file_name: fileName });
          await db.nic.create({ nic_number: nic, ...details, file_name: fileName });
        }
      }
    }
    res.json({ data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to validate NICs' });
  }
};

const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const nicNumbers = [];
    const readableStream = new stream.Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    readableStream.pipe(csv())
      .on('data', (data) => nicNumbers.push(data.nic))
      .on('end', () => resolve(nicNumbers))
      .on('error', (error) => reject(error));
  });
};

const getNicData = async (req, res) => {
  const { date, gender, file_name } = req.query;

  const whereConditions = {};

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    whereConditions.createdAt = {
      [Op.gte]: startDate,
      [Op.lt]: endDate,
    };
  }

  if (gender) {
    whereConditions.gender = gender;
  }

  if (file_name) {
    whereConditions.file_name = {
      [Op.like]: `%${file_name}%`,
    };
  }

  try {
    const nicData = await db.nic.findAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']],
    });
    res.json(nicData);
  } catch (err) {
    console.error('Failed to fetch NIC data:', err);
    res.status(500).json({ error: 'Failed to fetch NIC data' });
  }
};

module.exports = { validateNics, getNicData };
