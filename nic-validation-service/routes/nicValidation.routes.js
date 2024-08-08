const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware.js');
const { getNicData } = require('../controllers/nicValidation.controller');
const { validateNics } = require('../controllers/nicValidation.controller.js');

router.post('/validate', upload.array('files', 4), validateNics);
router.get('/', getNicData);

module.exports = router;
