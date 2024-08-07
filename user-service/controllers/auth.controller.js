const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  console.log('Received registration request:', req.body);
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};
