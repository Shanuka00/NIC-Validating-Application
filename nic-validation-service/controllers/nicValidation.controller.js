const csv = require('csv-parser');
const stream = require('stream');
const { getNicDetails } = require('../utils/nicUtils.js');
const db = require('../config/db.config.js');
const { Op } = require('sequelize');

// Handle NIC validation
const validateNics = async (req, res) => {
  const files = req.files;
  const validResults = [];
  const invalidResults = [];

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
          validResults.push({ ...details, file_name: fileName });
          try {
            await db.nic.create({ nic_number: nic, ...details, file_name: fileName });
          } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
              console.log(`NIC ${nic} already exists in the database. Skipping insertion.`);
            } else {
              throw error;
            }
          }
        } else {
          invalidResults.push({ nic_number: nic, file_name: fileName, reason: 'Invalid NIC format or details' });
        }
      }
    }
    res.json({ validData: validResults, invalidData: invalidResults });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to validate NICs' });
  }
};


// Parse CSV buffer to extract NIC numbers
const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const nicNumbers = [];
    const readableStream = new stream.Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    readableStream.pipe(csv())
      .on('data', (data) => nicNumbers.push(data.nic)) // Collect NIC numbers from CSV data
      .on('end', () => resolve(nicNumbers))
      .on('error', (error) => reject(error));
  });
};

// Get NIC data based on query parameters
const getNicData = async (req, res) => {
  const { date, gender, file_name, page = 1, limit = 12 } = req.query;

  const whereConditions = {};

  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate());
    endDate.setHours(23, 59, 59, 999);

    whereConditions.createdAt = {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
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
    const { count, rows } = await db.nic.findAndCountAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    });
  } catch (err) {
    console.error('Failed to fetch NIC data:', err);
    res.status(500).json({ error: 'Failed to fetch NIC data' });
  }
};


// Get statistics of NICs over the last 7 days
const getNicStats = async (req, res) => {
  try {
    const stats = await db.nic.findAll({
      attributes: [
        'gender',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
      ],
      where: {
        createdAt: {
          [Op.gte]: db.sequelize.literal("DATE_SUB(CURDATE(), INTERVAL 6 DAY)")
        }
      },
      group: ['gender', 'date'],
      order: [['date', 'ASC']],
    });

    res.json(stats);
  } catch (err) {
    console.error('Failed to fetch NIC stats:', err);
    res.status(500).json({ error: 'Failed to fetch NIC stats' });
  }
};

// Get gender distribution of NICs
const getGenderDistribution = async (req, res) => {
  try {
    const distribution = await db.nic.findAll({
      attributes: [
        'gender',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
      ],
      group: ['gender'],
    });

    res.json(distribution);
  } catch (err) {
    console.error('Failed to fetch gender distribution:', err);
    res.status(500).json({ error: 'Failed to fetch gender distribution' });
  }
};

module.exports = { validateNics, getNicData, getNicStats, getGenderDistribution };
