const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRegister } = require('../middleware/auth.middleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);

module.exports = router;